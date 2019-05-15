import { ADD_ARTICLE } from "../constants/action-types";

export const addArticle = payload => {
  return {
    type: ADD_ARTICLE,
    payload
  };
};
