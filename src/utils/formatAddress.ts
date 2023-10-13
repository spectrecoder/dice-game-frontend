const formatAddress = (address: string, sliceNum: number = 6) => {
  return `${address.slice(0, sliceNum)}...${address.slice(-sliceNum)}`;
};

export default formatAddress;
