import moment from 'moment-timezone'

export const iso_from_date = (d) => {
    let year = d.getFullYear();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    if (month < 10) month = '0'+month;
    if (day < 10) day = '0'+day;
    return year+'-'+month+'-'+day;
}

export const printDate = (date, tz, opts) => {
    if (tz && moment) {
        // Using moment.js to print local date/times
        let dt = moment.tz(date.getTime(), tz);
        let format = "YYYY-MM-DD";
        if (opts) {
            if (opts.format) format = opts.format;
            else if (opts['_with_time']) format = "YYYY-MM-DD HH:mm";
        }
        return dt.format(format);
    } else {
        if (date != null) {
            return iso_from_date(date);
        } else return "--";
    }
}

export const truncate = (s, _chars) => {
    if (s == null) s = ''
    let chars = _chars || 30;
    if (s.length > chars) return s.substring(0, _chars) + '...';
    else return s;
}

export const json_api_req = (method, url, data, csrf_token, success, fail) => {
    let body = method != 'GET' ? JSON.stringify(data) : null
    let fetch_opts = {
        credentials: 'include',
        method: method,
        body: body,
        headers: {
            'X-CSRFToken': csrf_token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    fetch(url, fetch_opts).then(res => res.json().then(data => {
        if (res.ok) {
            success(data)
        } else {
            fail(data)
        }
    }))
}

export const simple_api_req = (method, url, data, csrf_token, success, fail) => {
    let body = method != 'GET' ? JSON.stringify(data) : null
    let fetch_opts = {
        credentials: 'include',
        method: method,
        body: body,
        headers: {
            'X-CSRFToken': csrf_token
        }
    }
    fetch(url, fetch_opts).then(res => {
        if (res.ok) {
            success()
        } else {
            fail()
        }
    })
}
