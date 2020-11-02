import { FC } from "react";

/*
    Rough default page structure for app pages.
    Although similar to marketing now, this will likely become distinct
 */
// TODO: do margin top here tailwind style
// TODO: text-black should be something else
const Page: FC = (props) => {
    return (
        <>
            <section className="bg-gray-100 border-b py-4 md:py-8 page-class text-black">
                <div className="container mx-auto px-4">{props.children}</div>
            </section>
            <style jsx>{`
                .page-class {
                    margin-top: 72px;
                }
                @media screen and (max-width: 1023px) {
                    .page-class {
                        margin-top: 52px;
                    }
                }
            `}</style>
        </>
    );
};

export default Page;
