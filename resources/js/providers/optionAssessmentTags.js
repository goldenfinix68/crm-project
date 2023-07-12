// const optionAssessmentTags = [
//   // { value: "All Sports", label: "All Sports" },
//   { value: "Badminton", label: "Badminton" },
//   { value: "Baseball (Boys)", label: "Baseball (Boys)" },
//   { value: "Basketball", label: "Basketball" },
//   { value: "Cheerleading", label: "Cheerleading" },
//   { value: "Cross Country", label: "Cross Country" },
//   { value: "Field Hockey", label: "Field Hockey" },
//   { value: "Flag Football (Girls)", label: "Flag Football (Girls)" },
//   { value: "Football", label: "Football" },
//   { value: "Football (Boys)", label: "Football (Boys)" },
//   { value: "Golf", label: "Golf" },
//   { value: "Gymnastics", label: "Gymnastics" },
//   { value: "Hockey", label: "Hockey" },
//   { value: "Lacrosse", label: "Lacrosse" },
//   { value: "Soccer", label: "Soccer" },
//   { value: "Softball (Girls)", label: "Softball (Girls)" },
//   { value: "Swimming & Diving", label: "Swimming & Diving" },
//   { value: "Tennis", label: "Tennis" },
//   { value: "Track & Field", label: "Track & Field" },
//   { value: "Volleyball", label: "Volleyball" },
//   { value: "Water Polo", label: "Water Polo" },
//   { value: "Weightlifting", label: "Weightlifting" },
//   { value: "Wrestling", label: "Wrestling" },
// ];

import { GET } from "./useAxiosQuery";

const optionAssessmentTags = () => {
  const { data: dataGetAllSport } = GET(
    "api/v1/get_all_sport",
    "get_all_sport",
    (res) => {
      if (res.success) {
        console.log("get_all_sport", res);
        let row = [];
        res.data &&
          res.data.map((item, key) => {
            row.push({
              val: item.sport,
              label: item.sport,
            });
          });
        return row;
      }
    }
  );
};

export default optionAssessmentTags;
