import Vue from 'vue'

const formatDateTime = Vue.filter('formatDateTime', function (timestamp) {
    var ts = new Date(Number(timestamp));
    return ts.toLocaleString();
})

export default { formatDateTime }
