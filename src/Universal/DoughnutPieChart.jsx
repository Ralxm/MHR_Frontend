import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import ReactEchart from 'echarts-for-react';

echarts.use([TooltipComponent, PieChart, CanvasRenderer]);

const DoughnutPieChart = ({ data }) => {
    const { palette } = useTheme();

    const getColorForEstado = (estado) => {
        switch (estado) {
            case "Aprovada":
                return palette.success.main;
            case "Em análise":
                return palette.warning.main;
            case "Rejeitada":
                return palette.error.main;
            case "Reembolsada":
                return palette.success.main;
            default:
                return palette.text.secondary;
        }
    };

    const totalValue = useMemo(() => {
        return data.reduce((sum, item) => sum + item.value, 0).toFixed(2);
    }, [data]);

    const colors = useMemo(() => {
        return data.map((item) => getColorForEstado(item.name));
    }, [data, palette]);

    const getOptions = useMemo(
        () => ({
            color: colors,
            tooltip: {
                trigger: 'item',
                formatter: (params) => `<strong>${params.name}:</strong> ${params.value.toFixed(2)} € (${params.percent}%)`,
            },
            legend: { show: false },
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
                        formatter: `{x|${totalValue} €}`,
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
        [palette, data, totalValue, colors],
    );

    return (
        <ReactEchart
            echarts={echarts}
            option={getOptions}
            style={{ width: '100%', height: '300px' }}
        />
    );
};

export default DoughnutPieChart;