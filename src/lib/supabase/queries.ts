'use server'

import db from "@/lib/supabase/db";
import {Subscription} from "@/lib/supabase/supabase.types";

export const getUserSubscriptionStatus = async (userId: string) => {
    try {
        const data = await db.query.subscriptions.findFirst({
            where: (s, {eq}) => eq(s.userId, userId)
        })
        if (data) return {data: data as Subscription, error: null}
        else return {data: null, error: null}
    } catch (error: any) {
        console.error(`getUserSubscriptionStatus Error: ${error.message}`)
        return {data: null, error:`getUserSubscriptionStatus Error: ${error}`}
    }
}