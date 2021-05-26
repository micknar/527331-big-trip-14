import ChartDataLabels from 'chartjs-plugin-datalabels';

export const getChartLabels = (points) => points.map((point) => point.type.toUpperCase());

export const getUniquePointTypes = (points) => {
  const types = points.map((point) => point.type);

  return [...new Set(types)];
};

export const getPointsPrice = (points, types) => {
  const data = Array(types.length).fill(null);

  types.forEach((type, index) => {
    points
      .filter((point) => point.type === type)
      .forEach((point) => {
        data[index] += point.basePrice;
      });
  });

  return data;
};

export const getPointsCountByType = (points, types) => {
  const data = Array(types.length).fill(null);

  types.forEach((type, index) => data[index] = points.filter((point) => point.type === type).length);

  return data;
};

export const getPointsDuration = (points, types) => {
  const data = Array(types.length).fill(null);

  types.forEach((type, index) => {
    points
      .filter((point) => point.type === type)
      .forEach((point) => {
        data[index] += point.durationTimestamp;
      });
  });

  return data;
};

export const getChartSettings = (labels, data, text, formatter) => {
  return {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        display: true,
        text,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  };
};
