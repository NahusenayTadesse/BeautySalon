import { db } from "$lib/server/db";
import { reports } from "$lib/server/db/schema";
import { and, gte, lte, sql } from "drizzle-orm";

import { currentMonthFilter } from "$lib/global.svelte";
import type { PageServerLoad } from "../$types";




export const load: PageServerLoad = async({params})=>{

    const { range } = params as { range: string };    

     const [
  y1, m1, d1,
  y2, m2, d2,
] = range.split("-");

const start = `${y1}-${m1}-${d1}`;
const end   = `${y2}-${m2}-${d2}`; 

const filterCondition = and(
        // reports.reportDate >= start
        gte(reports.reportDate, start), 
        // reports.reportDate <= end
        lte(reports.reportDate, end)     
    );



    

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
    ).from(reports)
    .where (filterCondition);
  
  

    return{
         allReports,
         start,
         end,
         range
    }
}