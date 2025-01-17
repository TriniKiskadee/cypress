import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {createOrRetrieveCustomer} from "@/lib/stripe/admin-tasks";
import {stripe} from "@/lib/stripe";
import {getURL} from "@/lib/utils";
import {NextResponse} from "next/server";

export async function POST() {
    try {
        const supabase = createRouteHandlerClient({cookies})
        const {data: {user}} = await supabase.auth.getUser()
        if (!user) {
            throw new Error("Could not find user");
        }

        const customer = await createOrRetrieveCustomer({
            email: user?.email || '',
            uuid: user?.id || '',
        })

        if (!customer) {
            throw new Error("Could not find customer");
        }

        const {url} = await stripe.billingPortal.sessions.create({
            customer,
            return_url: `${getURL()}/dashboard`,
        })

        return NextResponse.json({ url })
    } catch (error: any) {
        console.log(`create-portal-link route error: ${error}`)
        return new NextResponse('Internal Error', {status: 500})
    }
}