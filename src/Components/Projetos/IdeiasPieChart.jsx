import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import ReactEchart from 'echarts-for-react';

echarts.use([TooltipComponent, PieChart, CanvasRenderer]);

const IdeiasPieChart = ({ ideias }) => {
    const { palette } = useTheme();

    const data = useMemo(() => {
        const counts = {
            'Aceite': 0,
            'Rejeitada': 0,
            'Em análise': 0
        };

        ideias.forEach(ideia => {
            counts[ideia.estado] = (counts[ideia.estado] || 0) + 1;
        });

        return [
            { value: counts['Em análise'], name: 'Em análise' },
            { value: counts['Aceite'], name: 'Aceite' },
            { value: counts['Rejeitada'], name: 'Rejeitada' },
        ].filter(item => item.value > 0);
    }, [ideias]);

    const colors = useMemo(() => {
        const colorMap = {
            'Aceite': palette.success.main,
            'Rejeitada': palette.error.main,
            'Em análise': palette.warning.main
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
                    return `<strong>${params.name}:</strong> ${params.value} ideia(s) (${params.percent}%)`;
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
                            borderWidth: 2
                        },
                    },
                    itemStyle: {
                        borderRadius: 2,
                        borderWidth: 2,
                        borderColor: 'transparent',
                    },
                    label: {
                        show: true,
                        position: 'center',
                        formatter: `{x|${total}}\n{y|Ideias}`,
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

export default IdeiasPieChart;