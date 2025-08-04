const authValidation = (req,res,next) => {
    const auth = req.headers["Authorization"] || req.headers["authorization"];
    
      if (auth == undefined) {
        return res.json({
          status: "error",
          data: null,
          code: 400,
          msg: "Token required",
        });
      }
      const token = auth.split(" ")[1];
    
      if (token == undefined) {
        return res.json({
          status: "error",
          data: null,
          code: 400,
          msg: "Token required",
        });
      }

      next()
}

module.exports = {authValidation}