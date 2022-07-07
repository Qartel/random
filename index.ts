import express from "express";
import Device, { IDevice } from "../../models/Device";
const router = express.Router();

// Get all
router.get("/device", async (req, res) => {
  try {
    const devices = await Device.aggregate([
      {
        $lookup: {
          from: "timedprofiles",
          localField: "_id",
          foreignField: "DeviceId",
          as: "tempprofile",
        },
      },
      {
        $unwind: {
          path: "$tempprofile",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    res.send(devices);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Site List Screen
router.get("/device/sites/:customer", async (req, res) => {
  const site_config_arr: any = [];

  const customerName = req.params.customer;
  try {
    const sites = await Device.aggregate([
      {
        $match: {
          CustomerName: customerName,
        },
      },
      {
        $group: {
          _id: {
            Site: "$Site",
            Service: "$Service",
            Scenario: "$Scenario",
          },
        },
      },
      {
        $project: {
          Site: "$_id.Site",
          Service: "$_id.Service",
          Scenario: "$_id.Scenario",
          _id: 0,
        },
      },
    ]);
    res.send(sites);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// all sites screen
router.get("/device/all_sites/:customer", async (req, res) => {
  const site_config_arr: any = [];

  const customerName = req.params.customer;
  try {
    const sites = await Device.aggregate([
      {
        $group: {
          _id: {
            Customer: "$CustomerName",
            Site: "$Site",
            Service: "$Service",
            Scenario: "$Scenario",
          },
        },
      },
      {
        $project: {
          Customer: "$_id.Customer",
          Site: "$_id.Site",
          Service: "$_id.Service",
          Scenario: "$_id.Scenario",
          _id: 0,
        },
      },
    ]);
    res.send(sites);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Site List in Menu
router.get("/device/menu/:customer", async (req, res) => {
  const site_config_arr: any = [];

  const customerName = req.params.customer;
  try {
    const sites = await Device.aggregate([
      {
        $match: {
          CustomerName: customerName,
        },
      },
      {
        $group: {
          _id: {
            Site: "$Site",
          },
        },
      },
      {
        $project: {
          Site: "$_id.Site",
          _id: 0,
        },
      },
    ]);
    res.send(sites);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// RFS List Screen
router.get("/device/links/:site/:customer", async (req, res) => {
  const siteName = req.params.site;
  const customerName = req.params.customer;
  try {
    const links = await Device.aggregate([
      {
        $match: {
          CustomerName: customerName,
          Site: siteName,
        },
      },
      {
        $group: {
          _id: {
            Customer: "$CustomerName",
            Site: "$Site",
            Service: "$Service",
            Scenario: "$Scenario",
          },
        },
      },
      {
        $project: {
          Customer: "$_id.Customer",
          Site: "$_id.Site",
          Service: "$_id.Service",
          Scenario: "$_id.Scenario",
          // InterfaceDescription: "$_id.InterfaceDescription",
          _id: 1,
        },
      },
    ]);
    res.send(links);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Customer List
router.get("/device/customer", async (req, res) => {
  try {
    const customer = await Device.aggregate([
      {
        $group: {
          _id: {
            CustomerName: "$CustomerName",
          },
        },
      },
      {
        $project: {
          Customer: "$_id.CustomerName",
          _id: 0,
        },
      },
    ]);

    res.send(customer);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Update per Site
router.put("/deviceSites/:site", async (req, res) => {
  try {
    const devicesAtSites = await Device.updateMany(
      { Site: req.params.site },
      {
        Scenario: req.body.scenario,
        AvailabilityProfile: req.body.Availability,
        Latency: req.body.Latency,
        PacketLoss: req.body.PacketLoss,
        UtilizationDown: req.body.UtilizationDown,
        UtilizationUp: req.body.UtilizationUp,
      }
    );

    if (!devicesAtSites) return res.status(404).send({ error: "Not found" });

    res.send(devicesAtSites);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update per scenario(config)
router.put("/scenario-device/:scenario", async (req, res) => {
  try {
    const scenarioName = req.params.scenario;

    // if (!scenarioName) return res.status(404).send({ error: "Not found" });

    const body = req.body;

    const scenarioMetrics = await Device.updateMany(
      { Scenario: scenarioName },
      {
        AvailabilityProfile: body.Availability,
        Latency: body.Latency,
        PacketLoss: body.PacketLoss,
        UtilizationDown: body.UtilizationDown,
        UtilizationUp: body.UtilizationUp,
      }
    );

    if (!scenarioMetrics) return res.status(404).send({ error: "Not found" });

    res.send(scenarioMetrics);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get one
router.get("/device/:id", async (req, res) => {
  try {
    if (req.params.id === "0") return res.send({});

    const device = await Device.findOne({ _id: req.params.id });

    if (!device) return res.status(404).json({ error: "Not found" });

    res.send(device);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Devices per Site
router.get("/device/deviceList/:site/", async (req, res) => {
  const link_config_arr: any = [];

  const siteName = req.params.site;
  const linkName = req.params.link;
  // const customerName = req.params.customer;
  try {
    const deviceList = await Device.aggregate([
      {
        $match: {
          Site: siteName,
        },
      },
      {
        $group: {
          _id: {
            Site: "$Site",
            MACAddress: "$MACAddress",
            SerialNumber: "$SerialNumber",
            InterfaceIP: "$InterfaceIP",
            AvailabilityProfile: "$AvailabilityProfile",
            Latency: "$Latency",
            PacketLoss: "$PacketLoss",
            UtilizationDown: "$UtilizationDown",
            UtilizationUp: "$UtilizationUp",
            Scenario: "$Scenario",
            Service: "$Service",
            InterfaceDescription: "$InterfaceDescription",
          },
        },
      },
      {
        $project: {
          Site: "$_id.Site",
          MACAddress: "$_id.MACAddress",
          SerialNumber: "$_id.SerialNumber",
          InterfaceIP: "$_id.InterfaceIP",
          AvailabilityProfile: "$_id.AvailabilityProfile",
          Latency: "$_id.Latency",
          PacketLoss: "$_id.PacketLoss",
          UtilizationDown: "$_id.UtilizationDown",
          UtilizationUp: "$_id.UtilizationUp",
          Scenario: "$_id.Scenario",
          _id: 0,
          Service: "$_id.Service",
          Link: "$_id.InterfaceDescription",
        },
      },
    ]);
    res.send(deviceList);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Create/update
router.put("/device/:id", async (req, res) => {
  try {
    let device: IDevice | null = new Device();

    if (req.params.id !== "0") {
      device = await Device.findOne({ _id: req.params.id });
      if (!device) return res.status(404).json({ error: "Not found" });
    }

    device!.set(req.body);
    await device.save();
    console.log("device", device);
    console.log("request body", req.body);

    res.send(device);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete
router.delete("/device/:id", async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.id });

    if (!device) return res.status(404).json({ error: "Not found" });

    await device!.delete();

    res.send(device);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
