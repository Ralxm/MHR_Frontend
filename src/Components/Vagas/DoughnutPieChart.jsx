import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import ReactEchart from 'echarts-for-react';

echarts.use([TooltipComponent, PieChart, CanvasRenderer]);

const DoughnutPieChart = ({ vagas, departamentos, candidaturas, onSetDepartamento, tipo }) => {
    const { palette } = useTheme();

    const data = useMemo(() => {
        const departamentoMap = {};
        const vagaMap = {};
        
        departamentos.forEach(dept => {
            departamentoMap[dept.id_departamento] = dept;
        });
        
        vagas.forEach(vaga => {
            vagaMap[vaga.id_vaga] = vaga;
        });

        if(tipo == 'vagas'){
            const counts = {};
            vagas.forEach(vaga => {
                const deptId = vaga.id_departamento;
                counts[deptId] = (counts[deptId] || 0) + 1;
            });
    
            return Object.entries(counts).map(([deptId, count]) => ({
                value: count,
                name: departamentoMap[deptId]?.nome_departamento || `Departamento ${deptId}`,
                departamento: departamentoMap[deptId]
            }));
        }
        else if(tipo == 'candidaturas'){
            const counts = {};
            candidaturas.forEach(candidatura => {
                const vaga = vagaMap[candidatura.id_vaga];
                if (vaga) {
                    const deptId = vaga.id_departamento;
                    counts[deptId] = (counts[deptId] || 0) + 1;
                }
            });
    
            return Object.entries(counts).map(([deptId, count]) => ({
                value: count,
                name: departamentoMap[deptId]?.nome_departamento || `Departamento ${deptId}`,
                departamento: departamentoMap[deptId]
            }));
        }
    }, [vagas, departamentos, candidaturas, tipo]);

    const colors = useMemo(() => {
        const colorPalette = [
            palette.primary.main,
            palette.secondary.main,
            palette.error.main,
            palette.warning.main,
            palette.success.main,
            palette.info.main
        ];
        return data.map((_, index) => colorPalette[index % colorPalette.length]);
    }, [data, palette]);

    const total = useMemo(() => {
        return data.reduce((sum, item) => sum + item.value, 0);
    }, [data]);

    const getOptions = useMemo(
        () => ({
            color: colors,
            tooltip: {
                trigger: 'item',
                formatter: (params) => {
                    const label = tipo === 'vagas' ? 'vaga(s)' : 'candidatura(s)';
                    return `<strong>${params.name}:</strong> ${params.value} ${label} (${params.percent}%)`;
                },
            },
            legend: {
                show: false
            },
            series: [
                {
                    type: 'pie',
                    padAngle: 1,
                    radius: ['100%', '85%'],
                    avoidLabelOverlap: false,
                    emphasis: {
                        scale: false,
                        itemStyle: {
                            color: 'inherit',
                        },
                    },
                    itemStyle: {
                        borderRadius: 2,
                        borderWidth: 1,
                        borderColor: 'transparent',
                    },
                    label: {
                        show: true,
                        position: 'center',
                        formatter: `{x|${total}}\n{y|${tipo === 'vagas' ? 'Vagas' : 'Candidaturas'}}`,
                        rich: {
                            x: {
                                fontSize: 24,
                                fontWeight: 700,
                                color: palette.text.primary,
                                padding: [0, 0, 5, 0],
                            },
                            y: {
                                fontSize: 14,
                                color: palette.text.secondary,
                                fontWeight: 400,
                            },
                        },
                    },
                    data: data,
                },
            ],
            grid: { containLabel: true },
        }),
        [palette, data, total, colors, tipo]
    );

    const onChartClick = (params) => {
        if (params.componentType === 'series' && params.data?.departamento) {
            onSetDepartamento(params.data.departamento);
        }
    };

    return (
        <ReactEchart
            echarts={echarts}
            option={getOptions}
            style={{ width: '100%', height: '250px' }}
            onEvents={{
                click: onChartClick
            }}
        />
    );
};

export default DoughnutPieChart;