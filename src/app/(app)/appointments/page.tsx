
'use client';

import { ArrowLeft, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function AppointmentsPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center space-x-2 sm:space-x-4 mb-2">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              My Appointments
            </h1>
          </div>
          <p className="text-gray-600 mt-1 ml-10 sm:ml-12">
            Track and manage your lab appointments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 self-end sm:self-auto">
          <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </header>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            Pending
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            Confirmed
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            Completed
          </TabsTrigger>
          <TabsTrigger value="canceled" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            Canceled
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-4">
              <CalendarDays className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No pending appointments
            </h3>
            <p className="text-gray-600 mt-2">
              When you schedule appointments, they'll appear here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="confirmed" className="mt-6">
             <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-4">
                <CalendarDays className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                No confirmed appointments
                </h3>
                <p className="text-gray-600 mt-2">
                Your confirmed appointments will be displayed here.
                </p>
            </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
             <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-4">
                <CalendarDays className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                No completed appointments
                </h3>
                <p className="text-gray-600 mt-2">
                Your past appointments will be listed here once completed.
                </p>
            </div>
        </TabsContent>
        <TabsContent value="canceled" className="mt-6">
             <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-4">
                <CalendarDays className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                No canceled appointments
                </h3>
                <p className="text-gray-600 mt-2">
                Your canceled appointments will be shown here.
                </p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
