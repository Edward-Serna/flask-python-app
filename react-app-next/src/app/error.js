"use client";

import Styles from "./styles/error.module.css";
import Image from "next/image";

Error.getInitialProps = ({ res, err }) => {
  const error = res ? res.statusCode : err ? err.statusCode : 404;
  return { error };
};

export default function Error({ error }) {
  return (
    <div className={Styles.mainpage}>
      <div className={Styles.contentArea}>
        <Image
          className={Styles.img}
          priority={true}
          src="/Modifly_Logo.svg"
          alt="Logo"
          width={140}
          height={40}
        />
        <div className={Styles.content}>
        <h4>Please try again...</h4>
        <p className={Styles.msg}>
            {error
              ? `${error} [Server-Sided ERROR]`
              : "An error occurred on client"}
          </p>
        
        </div>
      </div>
    </div>
  );
}
