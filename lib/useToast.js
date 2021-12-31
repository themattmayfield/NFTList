import { toast } from "react-toastify";

const Toast = ({ type, message }) => {
  //   return toast("lit");

  switch (type) {
    case "success":
      toast["success"](message);
      break;
    case "error":
      toast["error"](message);
      break;
    default:
      toast(message);
      break;
  }
};

export default Toast;
