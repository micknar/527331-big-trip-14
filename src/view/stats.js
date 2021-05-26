import Chart from 'chart.js';
import SmartView from './smart';
import {ChartSettings} from '../const';
import {getFormattedDuration} from '../utils/common';
import {
  getChartLabels,
  getUniquePointTypes,
  getPointsPrice,
  getPointsCountByType,
  getPointsDuration,
  getChartSettings
} from '../utils/stats';

const renderMoneyChart = (ctx, data) => {
  const sortedData = data.sort((a, b) => b.price - a.price);
  const chartData = sortedData.map((item) => item.price);

  return new Chart(ctx, getChartSettings(
    getChartLabels(sortedData),
    chartData,
    ChartSettings.TEXT.MONEY,
    (val) => `€ ${val}`,
  ));
};

const renderCountByTypeChart = (ctx, data) => {
  const sortedData = data.sort((a, b) => b.count - a.count);
  const chartData = sortedData.map((item) => item.count);

  return new Chart(ctx, getChartSettings(
    getChartLabels(sortedData),
    chartData,
    ChartSettings.TEXT.TYPE,
    (val) => `${val}x`,
  ));
};

const renderTimeSpendChart = (ctx, data) => {
  const sortedData = data.sort((a, b) => b.durationTimestamp - a.durationTimestamp);
  const chartData = sortedData.map((item) => item.durationTimestamp);

  return new Chart(ctx, getChartSettings(
    getChartLabels(sortedData),
    chartData,
    ChartSettings.TEXT.TIME_SPEND,
    (val) => getFormattedDuration(val),
  ));
};

const createStatsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class Stats extends SmartView {
  constructor(points) {
    super();
    this._points = points;

    this._moneyChart = null;
    this._countByTypeChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._countByTypeChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._countByTypeChart = null;
      this._timeSpendChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const countByTypeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeSpendCtx = this.getElement().querySelector('.statistics__chart--time');

    const uniquePointTypes = getUniquePointTypes(this._points);

    const price = getPointsPrice(this._points, uniquePointTypes);
    const count = getPointsCountByType(this._points, uniquePointTypes);
    const durationTimestamp = getPointsDuration(this._points, uniquePointTypes);

    const data = uniquePointTypes.map((type, index) => ({
      type,
      price: price[index],
      count: count[index],
      durationTimestamp: durationTimestamp[index],
    }));

    this._moneyChart = renderMoneyChart(moneyCtx, data);
    this._countByTypeChart = renderCountByTypeChart(countByTypeCtx, data);
    this._timeSpendChart = renderTimeSpendChart (timeSpendCtx, data);
  }
}
