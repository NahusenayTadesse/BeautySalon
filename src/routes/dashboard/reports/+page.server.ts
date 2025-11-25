import { db } from "$lib/server/db";
import { reports } from "$lib/server/db/schema";
import { sql } from "drizzle-orm";
import type { PageServerLoad } from "../$types";




export const load: PageServerLoad = async()=>{
     
    

    const allReports = await db.select(
        {
            id: reports.id,
date: sql<string>`DATE_FORMAT(${reports.reportDate}, '%W %Y-%m-%d')`,
            bookedAppointments: reports.bookedAppointments,
            productsSold: reports.productsSold,
            serviceRendered: reports.servicesRendered,
            dailyExpenses: reports.dailyExpenses,
            dailyIncome: reports.dailyIncome,
            transactions: reports.transactions,
            staffPaid: reports.staffPaid,
            totalStaffPaid: reports.totalStaffPaid,
            staffHired: reports.staffHired,
            staffFired: reports.staffFired
        }
    ).from(reports);
  
  

    return{
         allReports
    }
}