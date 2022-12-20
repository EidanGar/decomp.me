"use client" // TEMP

import { useEffect, useReducer } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { ThreeBarsIcon, XIcon } from "@primer/octicons-react"
import classNames from "classnames"

import Logotype from "../Logotype"

import LoginState from "./LoginState"
import styles from "./Nav.module.scss"
import Search from "./Search"

const desktopLink = "rounded bg-black/0 px-2 py-1 transition-colors hover:bg-black/5 active:translate-y-px dark:bg-white/0 dark:hover:bg-white/5"

export interface Props {
    border?: boolean
    children?: React.ReactNode
}

export default function Nav({ border, children }: Props) {
    const [isOpen, toggleOpen] = useReducer(isOpen => !isOpen, false)
    const toggleLabel = `${isOpen ? "Close" : "Open"} Global Navigation Menu`
    const router = useRouter()

    useEffect(() => {
        if (isOpen) {
            const onkeydown = evt => {
                if (evt.key === "Escape") {
                    toggleOpen()
                    document.getElementById("navtoggle").focus()
                    evt.preventDefault()
                }
            }

            document.body.addEventListener("keydown", onkeydown)
            return () => {
                document.body.removeEventListener("keydown", onkeydown)
            }
        }
    }, [isOpen, router])

    // If the user clicks outside the nav, close it
    useEffect(() => {
        if (isOpen) {
            document.body.addEventListener("click", toggleOpen)
            return () => document.body.removeEventListener("click", toggleOpen)
        }
    }, [isOpen])

    return (
        <nav
            className={classNames({
                [styles.container]: true,
                [styles.border]: border,
                "border-black/10 dark:border-white/[0.06]": border,
            })}
            aria-labelledby="navtoggle"
            data-open={isOpen}
            data-force-toggle={!!children}
            onClick={evt => evt.stopPropagation()} // Don't close the nav if the user clicks inside it
        >
            <ul className={classNames(styles.header, "px-2 md:px-8 lg:px-16")}>
                <li className={styles.headerItemMenuToggle}>
                    <button
                        id="navtoggle"
                        onClick={toggleOpen}
                        onAuxClick={() => window.open("/", "_blank")}
                        aria-label={toggleLabel}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <XIcon size={24} /> : <ThreeBarsIcon size={18} />}
                    </button>
                </li>
                <li className={styles.headerItemSiteLogo}>
                    <Link href="/">
                        <Logotype />
                    </Link>
                </li>
                <li className={styles.headerItemLoginState}>
                    <LoginState />
                </li>
                {children
                    ? <li className={styles.customchildren}>{children}</li>
                    : <li className={styles.desktopLinks}>
                        <ul className="ml-auto gap-2 text-sm text-black dark:text-gray-1">
                            <li>
                                <Search />
                            </li>
                            <li>
                                <Link href="/new" className={desktopLink}>New scratch</Link>
                            </li>
                            <li>
                                <Link href="/projects" className={desktopLink}>Projects</Link>
                            </li>
                            <div className="h-4 w-px bg-black/10 dark:bg-white/[0.06]" />
                            <li>
                                <Link href="/settings/appearance" className={desktopLink}>Settings</Link>
                            </li>
                        </ul>
                    </li>
                }
            </ul>
            <div className={classNames(styles.menu, "bg-white dark:bg-gray-10")}>
                <div className={styles.searchContainer}>
                    <Search className={styles.search} />
                </div>
                <ul className={styles.links}>
                    <li className="flex items-center justify-center">
                        <Link href="/">
                            <Logotype />
                        </Link>
                    </li>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/new">New scratch</Link>
                    </li>
                    <li>
                        <Link href="/projects">Projects</Link>
                    </li>
                    <li>
                        <Link href="/settings/appearance">Settings</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
