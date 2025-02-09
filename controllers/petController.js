const path = require("path");
const fs = require("fs");
const moment = require("moment");
const PetModel = require("../models/petModel");

const petController = {
  getReportPage: (req, res) => {
    const filePath = path.join(__dirname, "../views/index.html");
    const report = PetModel.getSummaryReport();

    fs.readFile(filePath, "utf8", (err, html) => {
      if (err) return res.status(500).send("Error loading index.html");

      const modifiedHtml = html
        .replace("{{phoenix_accepted}}", report.accepted.phoenix)
        .replace("{{phoenix_rejected}}", report.rejected.phoenix)
        .replace("{{dragon_accepted}}", report.accepted.dragon)
        .replace("{{dragon_rejected}}", report.rejected.dragon)
        .replace("{{owl_accepted}}", report.accepted.owl)
        .replace("{{owl_rejected}}", report.rejected.owl);

      res.send(modifiedHtml);
    });
  },

  getPhoenixForm: (req, res) => {
    const filePath = path.join(__dirname, "../views/phoenix.html");

    fs.readFile(filePath, "utf8", (err, html) => {
      if (err) {
        return res.status(500).send("Error loading phoenix.html");
      }

      const errorMessage = req.query.error
        ? `<p style="color:red;">${req.query.error}</p>`
        : "";
      const successMessage = req.query.success
        ? `<p style="color:green;">${req.query.success}</p>`
        : "";

      res.send(
        html
          .replace("{{errorMessage}}", errorMessage)
          .replace("{{successMessage}}", successMessage)
      );
    });
  },

  addPhoenix: (req, res) => {
    const { healthCheck, vaccineCount, fireProofCert } = req.body;

    // แปลงค่า fireProofCert เป็น Boolean และ vaccineCount เป็น Integer
    const fireProofCertBool = fireProofCert === "true";
    const vaccineInt = parseInt(vaccineCount, 10);

    let isAccepted = true;
    let errorMessage = "";

    // 📌 ตรวจสอบรูปแบบวันที่และความถูกต้อง
    if (!moment(healthCheck, "DD/MM/YYYY", true).isValid()) {
      isAccepted = false;
      errorMessage = "Invalid health check date format. Use DD/MM/YYYY.";
    } else {
      const healthDate = moment(healthCheck, "DD/MM/YYYY");
      const today = moment();

      if (healthDate.isAfter(today)) {
        isAccepted = false;
        errorMessage = "Health check date cannot be in the future.";
      }
    }

    // 📌 ตรวจสอบค่า vaccineCount
    if (isNaN(vaccineInt) || vaccineInt < 1) {
      isAccepted = false;
      errorMessage = "Invalid vaccine count. It must be a positive integer.";
    }

    // 📌 ตรวจสอบ Fire-Proof Certificate
    if (!fireProofCertBool) {
      isAccepted = false;
      errorMessage = "Phoenix must have a valid Fire-Proof Certificate.";
    }

    // ✅ สร้างข้อมูล Phoenix
    const phoenixData = {
      petId: PetModel.generateId(),
      foodId: PetModel.generateId(),
      type: "phoenix",
      healthCheck,
      vaccineCount: vaccineInt,
      fireProofCert: fireProofCertBool,
    };

    // 📝 บันทึกใน database.json
    PetModel.addPet("phoenix", phoenixData, isAccepted);

    // 🔄 ส่งผลลัพธ์ไปยังหน้า View
    return res.redirect(
      `/phoenix?${isAccepted ? "success" : "error"}=${encodeURIComponent(
        isAccepted ? "Phoenix has been successfully registered!" : errorMessage
      )}`
    );
  },

  getDragonForm: (req, res) => {
    const filePath = path.join(__dirname, "../views/dragon.html");

    fs.readFile(filePath, "utf8", (err, html) => {
      if (err) {
        return res.status(500).send("Error loading dragon.html");
      }

      const errorMessage = req.query.error
        ? `<p style="color:red;">${req.query.error}</p>`
        : "";
      const successMessage = req.query.success
        ? `<p style="color:green;">${req.query.success}</p>`
        : "";

      res.send(
        html
          .replace(/{{errorMessage}}/g, errorMessage || "")
          .replace(/{{successMessage}}/g, successMessage || "")
      );
    });
  },

  addDragon: (req, res) => {
    const { healthCheck, vaccineCount, pollutionLevel } = req.body;

    // แปลงค่าก่อนใช้งาน
    const vaccineInt = parseInt(vaccineCount, 10);
    const pollutionFloat = parseFloat(pollutionLevel);

    let isAccepted = true;
    let errorMessage = "";

    // 📌 ตรวจสอบรูปแบบและความถูกต้องของ `healthCheck`
    if (!moment(healthCheck, "DD/MM/YYYY", true).isValid()) {
      isAccepted = false;
      errorMessage = "Invalid health check date format. Use DD/MM/YYYY.";
    } else {
      const healthDate = moment(healthCheck, "DD/MM/YYYY");
      const today = moment();

      if (healthDate.isAfter(today)) {
        isAccepted = false;
        errorMessage = "Health check date cannot be in the future.";
      }
    }

    // 📌 ตรวจสอบค่า vaccineCount
    if (isNaN(vaccineInt) || vaccineInt < 1) {
      isAccepted = false;
      errorMessage = "Invalid vaccine count. It must be a positive integer.";
    }

    // 📌 ตรวจสอบค่า pollutionLevel (ต้องไม่เกิน 70.0%)
    if (isNaN(pollutionFloat) || pollutionFloat > 70.0) {
      isAccepted = false;
      errorMessage = "Dragon pollution level must be 70% or less.";
    }

    // ✅ สร้างข้อมูล Dragon
    const dragonData = {
      petId: PetModel.generateId(),
      foodId: PetModel.generateId(),
      type: "dragon",
      healthCheck,
      vaccineCount: vaccineInt,
      pollutionLevel: pollutionFloat,
    };

    // 📝 บันทึกใน database.json
    PetModel.addPet("dragon", dragonData, isAccepted);

    // 🔄 ส่งผลลัพธ์ไปยังหน้า View
    return res.redirect(
      `/dragon?${isAccepted ? "success" : "error"}=${encodeURIComponent(
        isAccepted
          ? "✅ Dragon has been successfully registered!"
          : errorMessage
      )}`
    );
  },




  getOwlForm: (req, res) => {
    const filePath = path.join(__dirname, "../views/owl.html");

    fs.readFile(filePath, "utf8", (err, html) => {
      if (err) {
        return res.status(500).send("Error loading dragon.html");
      }

      const errorMessage = req.query.error
        ? `<p style="color:red;">${req.query.error}</p>`
        : "";
      const successMessage = req.query.success
        ? `<p style="color:green;">${req.query.success}</p>`
        : "";

      res.send(
        html
          .replace(/{{errorMessage}}/g, errorMessage || "")
          .replace(/{{successMessage}}/g, successMessage || "")
      );
    });
  },

  addOwl: (req, res) => {
    const { healthCheck, vaccineCount, flightDistance } = req.body;

    // แปลงค่าก่อนใช้งาน
    const vaccineInt = parseInt(vaccineCount, 10);
    const flightFloat = parseFloat(flightDistance);

    let isAccepted = true;
    let errorMessage = "";

    // 📌 ตรวจสอบรูปแบบและความถูกต้องของ `healthCheck`
    if (!moment(healthCheck, "DD/MM/YYYY", true).isValid()) {
      isAccepted = false;
      errorMessage = "Invalid health check date format. Use DD/MM/YYYY.";
    } else {
      const healthDate = moment(healthCheck, "DD/MM/YYYY");
      const today = moment();

      if (healthDate.isAfter(today)) {
        isAccepted = false;
        errorMessage = "Health check date cannot be in the future.";
      }
    }

    // 📌 ตรวจสอบค่า vaccineCount
    if (isNaN(vaccineInt) || vaccineInt < 1) {
      isAccepted = false;
      errorMessage = "Invalid vaccine count. It must be a positive integer.";
    }

    // 📌 ตรวจสอบค่า flightDistance (ต้องมากกว่า 100 km)
    if (isNaN(flightFloat) || flightFloat < 100) {
      isAccepted = false;
      errorMessage = "Owl flight distance must be at least 100 km.";
    }

    // ✅ สร้างข้อมูล Owl
    const owlData = {
      petId: PetModel.generateId(),
      foodId: PetModel.generateId(),
      type: "owl",
      healthCheck,
      vaccineCount: vaccineInt,
      flightDistance: flightFloat,
    };

    // 📝 บันทึกใน database.json
    PetModel.addPet("owl", owlData, isAccepted);

    // 🔄 ส่งผลลัพธ์ไปยังหน้า View
    return res.redirect(
      `/owl?${isAccepted ? "success" : "error"}=${encodeURIComponent(
        isAccepted
          ? "✅ Owl has been successfully registered!"
          : errorMessage
      )}`
    );
  },

};

module.exports = petController;
