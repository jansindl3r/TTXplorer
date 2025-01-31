export const clickableRule = {
  cursor: "pointer",
  userSelect: "none",
};

export const cellRule = {
  borderTop: "1px solid black",
  width: "100%",
  padding: 10,
};

export const headerCellRule = ({theme}) => ({
  position: "sticky",
  top: -1,
  backgroundColor: theme.background,
  borderBottom: "1px solid black",
  marginBottom: -1,
})

export const rowLegendRule = {
  // borderRight: "1px solid black",
};
