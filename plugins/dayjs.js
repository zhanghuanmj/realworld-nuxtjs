import Vue from 'vue';
import dayjs from 'dayjs';

export default () => {
    Vue.filter('date', function (text, format = 'YYYY-MM-DD HH:mm:ss') {
        return dayjs(text).format(format);
    });
}