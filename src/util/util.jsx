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

export const randomId = (length = 8) => {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( let i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
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

export const get_link_source_icon = (url) => {
    const ICONS = [
        {
            strings: ["osf", "psyarxiv", "openscienceframework"],
            icon: '/sitestatic/icons/preprint_osf.png'
        },
        {
            strings: ["figshare"],
            icon: "/sitestatic/icons/preprint_figshare.svg"
        },
        {
            strings: ["ssrn"],
            icon: "/sitestatic/icons/preprint_ssrn.png"
        }
    ]
    let icon
    ICONS.forEach((icon_spec) => {
        let match = false
        icon_spec.strings.forEach((str) => {
            if (url.indexOf(str) > -1) {
                icon = icon_spec.icon
            }
        })
    })
    return icon
}

export const summarize_api_errors = (res) => {
    // Summarize all API errors in the most basic way to display in UI
    // Ex: {"account":["Object with username=blah does not exist."]}
    let messages = []
    Object.keys(res).forEach((key) => {
        messages = messages.concat(res[key])
    })
    return messages.join(' ')
}

export const unspecified = (s) => {
    return s == null || s.length == 0
}
