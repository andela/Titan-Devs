import { store } from "./redux/store";
import { App } from "..redux";
import { Provider } from "react-redux";

export const App = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
