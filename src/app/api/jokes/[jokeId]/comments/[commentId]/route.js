import Comment from "@/models/comment";
import Joke from "@/models/Joke";
import Admin from "@/models/admin";
import { getAdminSession } from "@/lib/session";
import connectToDatabase from "@/lib/mongodb";
import { headers } from 'next/headers'

export async function DELETE(request, { params }) {
    try {
        //check admin
        let adminAprove = false
        const session = await getAdminSession(request.cookies.get('adminSession')?.value);
        if (session?.adminId) {
            const admin = await Admin.findById(session.adminId);
            if (!!admin) {
                adminAprove = true;
            }
        }
        const headersList = await headers()
        const clientId = headersList.get('ClientId')

        await connectToDatabase();
        const { jokeId, commentId } = await params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return Response.json({ success: false, error: 'אופס לא מצאנו את התגובה' }, { status: 404 });
        }
        if (!adminAprove && clientId !== comment.clientId) {
            return Response.json({ success: false, error: 'נראה כאילו אתה מנסה לעשות משהו שאסור לך...' }, { status: 401 });
        }

        await Joke.findByIdAndUpdate(jokeId, { $pull: { comments: commentId } });
        const deletedComment = await Comment.findByIdAndDelete(commentId);



        return Response.json({ success: true, comment: deletedComment }, { status: 200 });

    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
