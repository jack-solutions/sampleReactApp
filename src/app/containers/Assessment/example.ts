import _ from "underscore";

export const getOptions = (preceedingPart: string = "") => {
  if (!preceedingPart) {
    return Object.keys(diseasesByChapter);
  }
  const diseases = diseasesByChapter[preceedingPart[0]] || [];
  return Array.from(
    new Set(
      diseases
        .map(d => {
          if (d.code.indexOf(preceedingPart) === 0) {
            let code = d.code;
            if (code.includes("-")) {
              code = code.slice(0, code.indexOf("-"));
            }
            return code.replace(preceedingPart, "")[0];
          }
          return null;
        })
        .filter(c => c)
    )
  );
};

export const getTree = rows => {
  const byIdDict = {};
  rows.forEach(r => (byIdDict[r.id] = r));
  const tree = [];
  rows.forEach(r => {
    //this line added by me--Anand

    if (r.title) {
      if (
        _.contains(
          ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
          r.title.charAt(0)
        )
      ) {
      } else {
        r.title = r.code + " " + r.title;
      }
    }
    //end
    if (r.type === "chapter") {
      tree.push(r);
    }
    if (r.parentId) {
      const parent = byIdDict[r.parentId];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(r);
    }
  });

  return tree;
};

export interface CIDDataType {
  id: number;
  chapter: string; // chapter number
  type: "chapter" | "block" | "category"; // chapter is on the top most.
  code: string;
  parentId: number | null; // determines whose parent is who, determines tree's structure
  depthInType: number; // how many level deep is the node in its type. if a block has a parent that is also a block with value 1 than the block will have value 2
  isLeaf?: boolean; // if isLeaf is true that means the node is a leaf, i.e. it doesn't have any children
  title: string;
}

export const diseases: Array<CIDDataType> = [
  {
    id: 1,
    chapter: "1",
    code: "1",
    parentId: null,
    depthInType: 1,
    isLeaf: false,
    type: "chapter",
    title: "Certain infectious or parasitic diseases"
  },
  {
    id: 2,
    chapter: "1",
    code: "1A0-L1",
    parentId: 1,
    depthInType: 1,
    isLeaf: false,
    type: "block",
    title: "Gastroenteritis or colitis of infectious origin"
  },
  {
    id: 3,
    chapter: "1",
    code: "1A0-L2",
    parentId: 2,
    depthInType: 2,
    isLeaf: false,
    type: "block",
    title: "Bacterial intestinal infections"
  },
  {
    id: 4,
    chapter: "1",
    code: "1A00",
    parentId: 3,
    depthInType: 1,
    isLeaf: true,
    type: "category",
    title: "Cholera"
  },
  {
    id: 5,
    chapter: "1",
    code: "1A01",
    parentId: 3,
    depthInType: 1,
    isLeaf: true,
    type: "category",
    title: "Intestinal infection due to other Vibrio"
  },
  {
    id: 6,
    chapter: "1",
    code: "1A02",
    parentId: 3,
    depthInType: 1,
    isLeaf: true,
    type: "category",
    title: "Intestinal infections due to Shigella"
  },
  {
    id: 7,
    chapter: "1",
    code: "1A03",
    parentId: 3,
    depthInType: 1,
    isLeaf: false,
    type: "category",
    title: " Intestinal infections due to Escherichia coli"
  },
  {
    id: 8,
    chapter: "1",
    code: "1A03.0",
    parentId: 7,
    depthInType: 2,
    isLeaf: true,
    type: "category",
    title: "Enteropathogenic Escherichia coli infection"
  },
  {
    id: 9,
    chapter: "1",
    code: "1A03.1",
    parentId: 7,
    depthInType: 2,
    isLeaf: true,
    type: "category",
    title: "Enterotoxigenic Escherichia coli infection"
  },

  {
    id: 11,
    chapter: "2",
    code: "2",
    parentId: null,
    depthInType: 1,
    isLeaf: false,
    type: "chapter",
    title: "Neoplasms"
  },
  {
    id: 12,
    chapter: "2",
    code: "2A0-L1",
    parentId: 11,
    depthInType: 1,
    isLeaf: false,
    type: "block",
    title: "Neoplasms of brain or central nervous system"
  },
  {
    id: 13,
    chapter: "2",
    code: "2A00",
    parentId: 12,
    depthInType: 1,
    isLeaf: false,
    type: "category",
    title: "Primary neoplasms of brain"
  },
  {
    id: 14,
    chapter: "2",
    code: "2A00.0",
    parentId: 13,
    depthInType: 2,
    isLeaf: false,
    type: "category",
    title: " Gliomas of brain"
  },
  {
    id: 15,
    chapter: "2",
    code: "2A00.00",
    parentId: 14,
    depthInType: 3,
    isLeaf: true,
    type: "category",
    title: "Glioblastoma of brain"
  },
  {
    id: 16,
    chapter: "2",
    code: "2A00.0Y",
    parentId: 14,
    depthInType: 3,
    isLeaf: true,
    type: "category",
    title: "Other specified gliomas of brain"
  },
  {
    id: 17,
    chapter: "2",
    code: "2A00.0Z",
    parentId: 14,
    depthInType: 3,
    isLeaf: true,
    type: "category",
    title: " Intestinal infections due to Escherichia coli"
  },
  {
    id: 18,
    chapter: "2",
    code: "2A00.1",
    parentId: 13,
    depthInType: 2,
    isLeaf: false,
    type: "category",
    title: "Embryonal tumours of brain"
  },
  {
    id: 19,
    chapter: "2",
    code: "2A00.10",
    parentId: 18,
    depthInType: 3,
    isLeaf: true,
    type: "category",
    title: "Medulloblastoma of brain"
  }
];

export const diseasesByChapter = diseases.reduce((acc, itm) => {
  if (!acc[itm.chapter]) {
    acc[itm.chapter] = [];
  }
  acc[itm.chapter].push(itm);
  return acc;
}, {});