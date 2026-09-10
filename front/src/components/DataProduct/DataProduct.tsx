import { useMemo } from "react";
import { ReactComponent as Database } from "components/Global/Icons/database.svg";
import Tooltip from "@mui/material/Tooltip";
import NotInterestedIcon from '@mui/icons-material/NotInterested';

import { useAppSelector } from "store/hooks/redux-hooks";
import { checkDomain } from "modules/tokenPermission/utils/user-token.util";
import { DomainModel } from "models/Global/domainsModel";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface DataProductProps {
  products: DomainModel[];
  loading?: boolean;
  onProductClick: (id: string) => void;
};

const ProductCardSkeleton = () => (
  <div
    className="
      bg-[--color-background]
      border
      border-[--color-border]
      p-4
      rounded-xl
      w-[290px]
      h-40
    "
  >
    <div className="flex items-center gap-5 mb-2 h-16">
      <Skeleton circle width={32} height={32} />

      <div className="flex-grow">
        <Skeleton height={28} width="80%" />
      </div>
    </div>

    <Skeleton count={2} />
  </div>
);

export default function DataProduct({
  products,
  loading,
  onProductClick,
}: DataProductProps) {
  const { user } = useAppSelector((state) => state.UserPermissions);
  const userDomains = user.domains;

  return (
    <div className="w-full text-left p-10">
      <h1
        className="
          text-3xl
          text-[--color-accent]
          font-bold
          mb-10
        "
      >
        {loading ? <Skeleton width={400} /> : "Principales dominios"}
      </h1>

      <div className="flex flex-wrap gap-5">
        {loading
          ? Array.from({
            length: 6,
          }).map((_, index) => <ProductCardSkeleton key={index} />)
          : products.map((d) => {
            if(!checkDomain(userDomains, d.id) || !d.active) {
              return null;
            }

            return (
              <button
                key={d.id}
                disabled={!d.active}
                onClick={() => onProductClick(d.id)}
                className="relative group bg-[--color-background] border border-[--color-border] p-4 rounded-xl w-[290px] h-40 cursor-pointer bg-white hover:border-[--color-accent] hover:shadow-sm transition-all duration-200"
              >
                {/*
                {!d.active ? (
                  <div className="absolute top-0 right-0 p-4">
                    <Tooltip title="Dominio Deshabilitado">
                      <NotInterestedIcon sx={{ color: 'red' }} />
                    </Tooltip>
                  </div>
                ) : null}
                */}
                <div
                  className="
                        flex
                        items-center
                        gap-3
                        mb-2
                        h-16
                      "
                >
                  <Database
                    className="
                          w-8
                          h-8
                          flex-shrink-0
                          text-[--color-accent]
                        "
                  />
                  <h2
                    className="
                          text-xl
                          font-semibold
                          text-[--color-text-primary]
                          transition-colors
                          group-hover:text-[--color-accent]
                        "
                  >
                    {d.name}
                  </h2>
                </div>
                <p
                  className="
                        text-sm
                        text-[--color-text-secondary]
                        text-wrap
                        line-clamp-2
                      "
                >
                  {d.description}
                </p>
              </button>
            );
          })}
      </div>
    </div>
  );
}
