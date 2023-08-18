import { ReactElement ,cloneElement } from 'react'
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink ({children, activeClassName, ...rest}: ActiveLinkProps) {
    const { asPath } = useRouter(); //ex: Se ele estiver na pagina blog => /posts

    //Se a rota/pagina que estamos acessando for igual ao link clicado entao ativamos o classname
    const className = asPath === rest.href ? activeClassName : '';

    return(
        <Link {...rest} legacyBehavior>
            {cloneElement(children, {
                className
            })}
        </Link>
    )
}