import { Brackets, SelectQueryBuilder } from 'typeorm';

export function applyTrigramSearch<T>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  columns: string[],
  searchTerm?: string,
): SelectQueryBuilder<T> {
  if (!searchTerm) return qb;

  const term = searchTerm.trim();

  qb.andWhere(
    new Brackets((qb2) => {
      columns.forEach((col, idx) => {
        const param = `search_${idx}`;
        const cond = `similarity(${alias}.${col}, :${param}) > 0.1`;
        if (idx === 0) qb2.where(cond, { [param]: term });
        else qb2.orWhere(cond, { [param]: term });
      });
    }),
  )
    .addOrderBy(
      `GREATEST(${columns
        .map((col) => `similarity(${alias}.${col}, :search_main)`)
        .join(', ')})`,
      'DESC',
    )
    .setParameter('search_main', term);

  return qb;
} 