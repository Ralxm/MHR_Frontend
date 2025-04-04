import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import ReactEchart from 'echarts-for-react';

echarts.use([TooltipComponent, PieChart, CanvasRenderer]);

const DoughnutPieChart = ({ vagas, departamentos, onSetDepartamento }) => {
    const { palette } = useTheme();

    const data = useMemo(() => {
        const departamentoMap = {};
        departamentos.forEach(dept => {
            departamentoMap[dept.id_departamento] = dept;
        });

        const counts = {};
        vagas.forEach(vaga => {
            const deptId = vaga.id_departamento;
            counts[deptId] = (counts[deptId] || 0) + 1;
        });

        return Object.entries(counts).map(([deptId, count]) => ({
            value: count,
            name: departamentoMap[deptId] || `Departamento ${deptId}`,
            departamento: departamentoMap[deptId]
        }));
    }, [vagas, departamentos]);

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

    const totalVagas = useMemo(() => {
        return data.reduce((sum, item) => sum + item.value, 0);
    }, [data]);

    const getOptions = useMemo(
        () => ({
            color: colors,
            tooltip: {
                trigger: 'item',
                formatter: (params) =>
                    `<strong>${params.name}:</strong> ${params.value} vaga(s) (${params.percent}%)`,
            },
            legend: {
                show: false
            },
            series: [
                {
                    type: 'pie',
                    padAngle: 1,
                    radius: ['100%', '94%'],
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
                        formatter: `{x|${totalVagas}}\n{y|Vagas}`,
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
        [palette, data, totalVagas, colors]
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
            style={{ width: '100%', height: '300px' }}
            onEvents={{
                click: onChartClick
            }}
        />
    );
};

export default DoughnutPieChart;