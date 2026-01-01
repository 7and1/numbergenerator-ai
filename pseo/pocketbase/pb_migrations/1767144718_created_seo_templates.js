/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const collection = new Collection({
      id: "qbak3603d81hhb7",
      created: "2025-12-31 01:31:58.741Z",
      updated: "2025-12-31 01:31:58.741Z",
      name: "seo_templates",
      type: "base",
      system: false,
      schema: [
        {
          system: false,
          id: "mog2jgol",
          name: "type",
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
          id: "us1jkc0g",
          name: "title_template",
          type: "text",
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "3bdiwbuf",
          name: "meta_desc",
          type: "text",
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: "",
          },
        },
        {
          system: false,
          id: "0nmmzdal",
          name: "content_top",
          type: "editor",
          required: false,
          presentable: false,
          unique: false,
          options: {
            convertUrls: false,
          },
        },
        {
          system: false,
          id: "7qlgn8ww",
          name: "content_bottom",
          type: "editor",
          required: false,
          presentable: false,
          unique: false,
          options: {
            convertUrls: false,
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
    const collection = dao.findCollectionByNameOrId("qbak3603d81hhb7");

    return dao.deleteCollection(collection);
  },
);
