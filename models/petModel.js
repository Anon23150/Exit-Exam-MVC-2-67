const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../database.json");

const PetModel = {
  // อ่านข้อมูลจาก database.json
  readData: () => {
    try {
      const data = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading database.json:", error);
      return {
        accepted: { phoenix: [], dragon: [], owl: [] },
        rejected: { phoenix: [], dragon: [], owl: [] },
      };
    }
  },

  // เขียนข้อมูลลง database.json
  writeData: (newData) => {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), "utf8");
      return true;
    } catch (error) {
      console.error("Error writing to database.json:", error);
      return false;
    }
  },

  // ดึงข้อมูลรายงาน
  getSummaryReport: () => {
    const data = PetModel.readData();
    return {
      accepted: {
        phoenix: data.accepted.phoenix.length,
        dragon: data.accepted.dragon.length,
        owl: data.accepted.owl.length,
      },
      rejected: {
        phoenix: data.rejected.phoenix.length,
        dragon: data.rejected.dragon.length,
        owl: data.rejected.owl.length,
      },
    };
  },

  addPet: (type, petData, isAccepted) => {
    const data = PetModel.readData();
    if (isAccepted) {
      data.accepted[type].push(petData);
    } else {
      data.rejected[type].push(petData);
    }
    return PetModel.writeData(data);
  },

  generateId: () => {
    let newId;
    let isDuplicate;
    const data = PetModel.readData();

    do {
      const firstDigit = Math.floor(Math.random() * 9) + 1;
      const otherDigits = Math.floor(Math.random() * 10000000).toString().padStart(7, "0");
      newId = `${firstDigit}${otherDigits}`;

      isDuplicate = Object.values(data.accepted)
        .flat()
        .concat(Object.values(data.rejected).flat())
        .some((pet) => pet.petId === newId || pet.foodId === newId);
    } while (isDuplicate);

    return newId;
  },
};

module.exports = PetModel;
