
<section 
style="max-width:750px;">
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
            <h2 style="color: black;font-size: 22px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 700;">CTRLFIND</h2>
            <h2 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">SMART VISION EMBEDDED SYSTEMS INC.</h2>
            <h2 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">202-5001 Av Eliot</h2>
            <h2 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Laval QC H7W0G1</h2>
            <h2 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">info@smartvisionsystems.com</h2>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">GST/HST - TPS/TVH</h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">822268561 RT0001</h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">PST/RST/QST - TVQ </h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">1222738489-TQ00001</h3>
        </div>
        <div style="position: absolute; right:5px;top:5px; width:150px; height:100px">
             <img src="https://cntrlfind.com//storage/logo.jpg" style="width:100%; height:100%">
        </div>
      </div>
    </div>
    <div style="width:100%; display:flex; position: relative;"
      >
        <div style=" width:50%;">
          <h2 style="color: black;font-size: 22px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 700;">BILL TO - FACTURER A</h2>
          <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $user->name }}</h3>
          <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $user->address_office ? $user->address_office : $user->address_home }}</h3>
        </div>
       
        <div style="width:50%;">
            <h2 style="text-align:end; color: black;font-size: 22px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 700;">INVOICE - FACTURE</h2>
            <h3 style="text-align:end; color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <span style="padding:3px; margin:1px; background:lightgray;">
              {{ $invoice }}
                </span>
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
        

            <tr>
                <td style="border: 1px solid;padding: 5px; ">{{ $subscription->name ? $subscription->name : "" }}</td>
                <td style="border: 1px solid;padding: 5px; text-align: center;">1</td>
                <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $package->sub_total }}</td>
                <td style="border: 1px solid;padding: 5px; text-align: center;">{{ 1 *  $package->sub_total }}</td>
            
            </tr>


           
        </tbody>
      </table>
     
    <div style="width: 100%;justify-content:flex-end;display: flex;margin-top: 20px;">
        <table style="border-collapse: collapse;width: 50%; margin-left:auto;">
            <tbody>
                <tr>
                    <td style="border: 1px solid;padding: 5px; ">SUBTOTAL - TOTAL PARTIEL</td>
                    <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $package->sub_total }}</td>
                </tr>
                @if($package->gst)
                <tr>
                    <td style="border: 1px solid;padding: 5px; ">GST/HST - TPS/TVH <span>
                      {{ $province ? $province->gst_tax_percentage . '%' : '' }}</span></td>
                    <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $package->gst }}</td>
                </tr>
                @endif
                @if($package->pst)
                <tr>
                    <td style="border: 1px solid;padding: 5px; ">PST/RST - TVH <span>
                      {{ $province ? $province->pst_tax_percentage . '%' : '' }}</span></td>
                    <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $package->pst}}</td>
                </tr>
                @endif
                <tr>
                    <td style="border: 1px solid;padding: 5px; font-weight:bold; ">TOTAL DUE - TOTAL DU</td>
                    <th style="border: 1px solid;padding: 5px; text-align: center;">CAD {{ $package->price }}</th>
                </tr>
            </tbody>
          </table>
    </div>
</section>
