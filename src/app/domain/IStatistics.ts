export interface IStatistics {
  userCount : number;
  totalOrders : number;
  completedOrders : number,
  costEarned : number,
}

export default function DefaultStatistics() : IStatistics {
  return {
    userCount : 0,
    totalOrders : 0,
    completedOrders : 0,
    costEarned : 0
  };
}
