const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-3 mt-3 gap-4 pt-5 pr-7">
      {/* 
          Display 4 Cards  
        1. Total Income
        2. Total Staffs
        3. Total Orders
        4. Low amount stock (less than 10) 
      */}
      <div className="bg-primary-foreground rounded-lg p-4 col-span-3">test</div>

      {/* Line chart (sales analytics) */}
      <div className="bg-primary-foreground rounded-lg p-4 col-span-2">test</div>
      {/* Top 3 Staffs Monthly */}
      <div className="bg-primary-foreground rounded-lg p-4 col-span-1">test</div>

      {/* Top 5 Products Monthly */}
      <div className="bg-primary-foreground rounded-lg p-4 col-span-1">test</div>
      {/* Calendar */}
      <div className="bg-primary-foreground rounded-lg p-4 col-span-1">test</div>
      {/* Products with stock less than 10 */}
      <div className="bg-primary-foreground rounded-lg p-4 col-span-1">test</div>
    </div>
  );
};

export default AdminDashboard;
