import * as lux from "luxon";

export const now = () => {
    return lux.DateTime.now();
}

export const moment = (
    year = lux.DateTime.now().year,
    month = lux.DateTime.now().month,
    day,
    hour,
    min ) => {
    return lux.DateTime.local(
        year,
        month,
        day,
        hour,
        min - (min % 5)
    )
}

export const timeTo = (date) => {

}