import * as lux from luxon;

export const now = () => {
    return lux.now();
}

export const moment = (
    year = lux.now().year,
    month = lux.now().month,
    day,
    hour,
    min ) => {
    return lux.local(
        year,
        month,
        day,
        hour,
        min - (min % 5)
    )
}

export const timeTo = (date) => {
    
}