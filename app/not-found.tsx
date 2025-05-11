import Link from "next/link";

export default async function NotFound() {
    

    return (
        <div>
            <h2>Not Found</h2>
            <p>
                Go back to <Link href="/">home</Link>.
            </p>
        </div>
    );
}