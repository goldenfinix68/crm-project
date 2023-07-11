export default function getUserData() {
  let userdata = localStorage.getItem("userdata");

  if (userdata === null || userdata === "") {
    localStorage.setItem("userdata", "");
    return false;
  }
  // return JSON.parse(localStorage.userdata);
}
