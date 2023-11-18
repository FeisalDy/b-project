const { USDMClient } = require('binance')

exports.getAccountInformation = async (req, res) => {
  const { apiKey, apiSecret } = req.body

  if (!apiKey || !apiSecret) {
    return res
      .status(400)
      .json({ error: 'API key and API secret are required.' })
  }

  const client = new USDMClient({
    api_key: apiKey,
    api_secret: apiSecret
  })

  try {
    const result = await client.getAccountInformation()
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: 'Error fetching balance.' })
  }
}

exports.getFuturesAccountBalance = async (req, res) => {
  const { apiKey, apiSecret } = req.body

  if (!apiKey || !apiSecret) {
    return res
      .status(400)
      .json({ error: 'API key and API secret are required.' })
  }

  const client = new USDMClient({
    api_key: apiKey,
    api_secret: apiSecret
  })

  try {
    const result = await client.getBalance()
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: 'Error fetching balance.' })
  }
}
