import pg from "pg";

// Nuxt автоматически подтянет DATABASE_URL из .env или из environment Docker
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

export default defineEventHandler(async (event) => {
  try {
    const plansSql = `
      SELECT 
        "Номенклатурная группа" as group_name,
        TO_CHAR("Дата погрузки заявлено", 'Mon YYYY') as month_label,
        SUM("К-во вагонов заявлено") as wagon_sum,
        SUM("К-во тонн заявлено") as tonn_sum
      FROM shipments
      GROUP BY 1, 2
      ORDER BY 1, 2
    `;

    const mgspSql = `
      SELECT 
        "Выходной стык КЗХ" as junction,
        "Номенклатурная группа" as group_name,
        TO_CHAR("Дата погрузки заявлено", 'MM YYYY') as month_label,
        SUM("К-во вагонов заявлено") as wagons,
        SUM("К-во тонн заявлено") as tons
      FROM shipments
      GROUP BY 1, 2, 3
      ORDER BY 1, 2, 3
    `;

    const coalSql = `SELECT "НОД", "Станция погрузки", "Номер плана", "Грузоотправитель", "Наименование груза (ЕТСНГ)", "Страна назначения", "Выходной стык КЗХ", "К-во вагонов заявлено" as wagons, "К-во тонн заявлено" as tons FROM shipments WHERE "Наименование груза (ЕТСНГ)" ILIKE '%уголь%'`;

    const barleySql = `SELECT "НОД", "Станция погрузки", "Номер плана", "Грузоотправитель", "Наименование груза (ЕТСНГ)", "Страна назначения", "Выходной стык КЗХ", "К-во вагонов заявлено" as wagons, "К-во тонн заявлено" as tons FROM shipments WHERE "Выходной стык КЗХ" = 'Актау-Порт (перев., эксп.)' AND "Наименование груза (ЕТСНГ)" ILIKE '%Ячмень%'`;

    const portsSql = `SELECT "НОД", "Станция погрузки", "Номер плана", "Грузоотправитель", "Наименование груза (ЕТСНГ)", "Страна назначения", "Выходной стык КЗХ", "К-во вагонов заявлено" as wagons, "К-во тонн заявлено" as tons FROM shipments WHERE "Выходной стык КЗХ" IN ('Актау-Порт (перев., эксп.)', 'Курык-Порт (эксп., паром)', 'Курык-Порт (эксп., перев.)') AND NOT ("Выходной стык КЗХ" = 'Актау-Порт (перев., эксп.)' AND "Наименование груза (ЕТСНГ)" ILIKE '%Ячмень%')`;

    const [plans, mgsp, coal, barley, ports] = await Promise.all([
      pool.query(plansSql),
      pool.query(mgspSql),
      pool.query(coalSql),
      pool.query(barleySql),
      pool.query(portsSql)
    ]);

    return {
      plans: plans.rows,
      mgsp: mgsp.rows,
      coal: coal.rows,
      barley: barley.rows,
      ports: ports.rows
    };
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    });
  }
});
