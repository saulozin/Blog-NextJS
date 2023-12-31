import { GetServerSideProps } from 'next';
import styles from './post.module.scss';
import Head from 'next/head';
import Image from 'next/image';

import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';

type Post = {
    slug: string;
    title: string;
    description: string;
    cover: string;
    updatedAt: string;
}

interface PostProps {
    post: Post
}

export default function Post({ post }: PostProps) {

    return (
       <>
            <Head>
                <title>{post.title}</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <Image
                        src={post.cover}
                        alt={post.title}
                        width={720}
                        height={410}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFc5JAAAADUlEQVR42mNkuPn/IgAFZAKrxUlgaAAAAABJRU5ErkJggg=="
                        quality={100}
                    />

                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.description}}></div>
                </article>
            </main>
       </> 
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

    const { slug } = params;

    const prismic = getPrismicClient(req);

    const response = await prismic.getByUID('post', String(slug), {});

    //console.log((await response).data);

    if(!response){
        return{
            redirect: {
                destination: '/posts',
                permanent: false,
            }
        }
    }

    const post = {
        slug: slug,
        title: RichText.asText(response.data.title),
        description: RichText.asHtml(response.data.description),
        cover: response.data.cover.url,
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }),
    }

    return {
        props: {
            post,
        }
    }
}