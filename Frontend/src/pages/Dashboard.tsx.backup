import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:space-x-6">
        <Card className="flex-1 p-6">
          <h3 className="text-lg font-semibold text-primary-400 mb-4">Total Balance</h3>
          <p className="text-3xl font-bold text-primary-50">$0.00</p>
        </Card>
        <Card className="flex-1 p-6">
          <h3 className="text-lg font-semibold text-primary-400 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-400">No transactions yet</div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <Button variant="outline" className="w-full">
            View Accounts
          </Button>
        </Card>
        <Card className="p-6">
          <Button variant="outline" className="w-full">
            Make Transfer
          </Button>
        </Card>
        <Card className="p-6">
          <Button variant="outline" className="w-full">
            Add Account
          </Button>
        </Card>
      </div>
    </div>
  );
};