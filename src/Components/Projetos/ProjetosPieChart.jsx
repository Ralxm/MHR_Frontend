import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import ReactEchart from 'echarts-for-react';

echarts.use([TooltipComponent, PieChart, CanvasRenderer]);

const ProjetosPieChart = ({ projetos }) => {
    const { palette } = useTheme();

    const data = useMemo(() => {
        const counts = {
            'Aprovada': 0,
            'Rejeitada': 0,
            'Pendente': 0,
            'Em análise': 0
        };

        projetos.forEach(projeto => {
            counts[projeto.estado] = (counts[projeto.estado] || 0) + 1;
        });

        return [
            { value: counts['Em desenvolvimento'], name: 'Em desenvolvimento' },
            { value: counts['Concluído'], name: 'Concluído' },
            { value: counts['Parado'], name: 'Parado' },
        ].filter(item => item.value > 0);
    }, [projetos]);

    const colors = useMemo(() => {
        const colorMap = {
            'Concluído': palette.success.main,
            'Parado': palette.error.main,
            'Em desenvolvimento': palette.warning.main
        };
        return data.map(item => colorMap[item.name]);
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
                    return `<strong>${params.name}:</strong> ${params.value} projeto(s) (${params.percent}%)`;
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
                        formatter: `{x|${total}}\n{y|Projetos}`,
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
        [palette, data, total, colors]
    );

    return (
        <ReactEchart
            echarts={echarts}
            option={getOptions}
            style={{ width: '100%', height: '270px' }}
        />
    );
};

export default ProjetosPieChart;