<section style="max-width:750px;">
  <div
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width:100%;
            position: relative;
          "
        >
          <div style="width:80%">
              <h2 style="color: black;font-size: 22px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 700;">CNTRLFIND</h2>
              <h2 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">SMART VISION EMBEDDED SYSTEMS INC.</h2>
              <h2 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">202-5001 Av Eliot</h2>
              <h2 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Laval QC H7W0G1</h2>
              <h2 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">info@smartvisionsystems.com</h2>
              <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">GST/HST - TPS/TVH</h3>
              <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $provider->gst ? $provider->gst : "" }}</h3>
              <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">PST/RST/QST - TVQ </h3>
              <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $provider->pst ? $provider->pst : "" }}</h3>
          </div>
          <div style="position: absolute; right:5px;top:5px; width:150px; height:150px">
              <img src="{{ $cart['image'] }}" style="width:100%; height:100%">
          </div>
        </div>
      </div>
      <div style="width:100%; display:flex; position: relative;"
        >
          <div style=" width:50%;">
            <h2 style="color: black;font-size: 22px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 700;">BILL TO - FACTURER A</h2>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $cart['provider_name'] }}</h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $provider->address_office ? $provider->address_office : $provider->address_home }}</h3>
          </div>
        
          <div style="width:50%;">
              <h2 style="text-align:end; color: black;font-size: 22px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 700;">INVOICE - FACTURE</h2>
              <h3 style="text-align:end; color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          @foreach ($invoices as $invoice)
                  <span style="padding:3px; margin:1px; background:lightgray;">
                {{ $invoice }}
                  </span>
          @endforeach
      </h3>
              <h3 style="text-align:end; color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ now()}}</h3>
            </div>
        </div>

        <table style="  border-collapse: collapse; width:100%;">
          <thead>
            <tr>
              <th style="border: 1px solid;padding: 5px;  width: 50%;">DESCRIPTION</th>
              <th style="border: 1px solid;padding: 5px; ">QTY - QTE</th>
              <th style="border: 1px solid;padding: 5px; ">PRICE - PRIX</th>
              <th style="border: 1px solid;padding: 5px; ">AMOUNT - MONTANT</th>
            </tr>
          </thead>
          <tbody>
          @foreach ($cart["items"] as $item)

          <tr>
                  <td style="border: 1px solid;padding: 5px; ">{{ $item['name'] }}</td>
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $item['qty'] }}</td>
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $item['price'] }}</td>
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $item['qty'] *  $item['price'] }}</td>
              
              </tr>

            @endforeach
            
          </tbody>
        </table>
      
      <div style="width: 100%;justify-content:flex-end;display: flex;margin-top: 20px;">
          <table style="border-collapse: collapse;width: 50%; margin-left:auto;">
              <tbody>
                  <tr>
                      <td style="border: 1px solid;padding: 5px; ">SUBTOTAL - TOTAL PARTIEL</td>
                      <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $cart['total_before_tax'] }}</td>
                  </tr>
                  <tr>
                      <td style="border: 1px solid;padding: 5px; ">COUPON</td>
                      <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $cart['discount'] }}</td>
                  </tr>
                  <tr>
                      <td style="border: 1px solid;padding: 5px; ">GST/HST - TPS/TVH</td>
                      <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $cart['gst'] }}</td>
                  </tr>
                  <tr>
                      <td style="border: 1px solid;padding: 5px; ">PST/RST - TVH</td>
                      <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $cart['pst'] }}</td>
                  </tr>
                  <tr>
                      <td style="border: 1px solid;padding: 5px; font-weight:bold; ">TOTAL DUE - TOTAL DU</td>
                      <th style="border: 1px solid;padding: 5px; text-align: center;">USD {{$cart['total_price'] }}</th>
                  </tr>
              </tbody>
            </table>
      </div>
</section>