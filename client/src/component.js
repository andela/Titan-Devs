import { connect } from "react-redux";
const mapStateToProps = state => {
  return { articles: state.articles };
};

const connectedList = props => {
  return <div>hello{props}</div>;
};

export const List = connect(mapStateToProps)(connectedList);
