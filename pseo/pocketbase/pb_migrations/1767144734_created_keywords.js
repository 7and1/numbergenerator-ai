/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const collection = new Collection({
      id: "xaudc7jln09kfqu",
      created: "2025-12-31 01:32:14.699Z",
      updated: "2025-12-31 01:32:14.699Z",
      name: "keywords",
      type: "base",
      system: false,
      schema: [
        {
          system: false,
          id: "7c31kkph",
          name: "slug",
          type: "text",
          required: true,
          presentable: false,
          unique: true,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "hb4pqs3m",
          name: "type",
          type: "select",
          required: true,
          presentable: false,
          unique: false,
          options: {
            maxSelect: 1,
            values: ["range", "digit", "password", "lottery", "list"],
          },
        },
        {
          system: false,
          id: "qmsdh50h",
          name: "params",
          type: "json",
          required: true,
          presentable: false,
          unique: false,
          options: {
            maxSize: 200000,
          },
        },
        {
          system: false,
          id: "5zr0tdwp",
          name: "allow_indexing",
          type: "bool",
          required: false,
          presentable: false,
          unique: false,
          options: {},
        },
        {
          system: false,
          id: "hisnqp6a",
          name: "volume",
          type: "number",
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            noDecimal: true,
          },
        },
        {
          system: false,
          id: "tyhevrma",
          name: "clicks",
          type: "number",
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            noDecimal: true,
          },
        },
      ],
      indexes: [],
      listRule: "",
      viewRule: "",
      createRule: "",
      updateRule: "",
      deleteRule: "",
      options: {},
    });

    return Dao(db).saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("xaudc7jln09kfqu");

    return dao.deleteCollection(collection);
  },
);
