import moment from "moment";

export default function generateEvents(schedule_data) {
    let events = [];
    if (schedule_data.length > 0) {
        schedule_data.forEach((item) => {
            const date_schedule = moment(item?.date_schedule);
            const date_end = moment(
                item.date_end ? item.date_end : item?.date_schedule
            );
            const diff = date_end.diff(date_schedule, "days");

            // console.log("data: ", item);
            for (let x = 0; x <= diff; x++) {
                if (item) {
                    let start = moment(
                        item?.date_schedule + " " + item?.time_start,
                        "YYYY-MM-DD HH:mm"
                    )
                        .add(x, "days")
                        .format("Y-MM-DDTHH:mm:ss");
                    let end = moment(item?.date_schedule + " " + item?.time_end)
                        .add(x, "days")
                        .format("Y-MM-DDTHH:mm:ss");

                    // console.log("start", start);
                    events.push({
                        title: item?.techname,
                        // item.technician.first_name +
                        // " " +
                        // item.technician.last_name,
                        start: start,
                        // end: end,
                        extendedProps: item,
                    });
                }
            }
        });

        return events;
    }
}
