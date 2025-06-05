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
            <h2 style="color: black;font-size: 22px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 700;">{{ $provider->name }}</h2>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $provider->address_office ? $provider->address_office : $provider->address_home}}</h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">GST/HST - TPS/TVH</h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $provider->gst ? $provider->gst : "" }}</h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">PST/RST/QST - TVQ </h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $provider->pst ? $provider->pst : "" }}</h3>

          </div>
          <div style="position: absolute; right:5px;top:5px; width:150px; height:150px">
              <img src="{{ url('storage/'.$provider->avatar) }}" style="width:100%; height:100%">

          </div>
        </div>
      </div>
      <div style="width:100%; display:flex; position: relative;"
        >
          <div style=" width:50%;">
            <h2 style="color: black;font-size: 22px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 700;">BILL TO - FACTURER A</h2>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $buyer->name}}</h3>
            <h3 style="color: black; font-weight: 500;font-size: 15px;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">{{ $order->delivery_address }}</h3>
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
              @if($status != 'extra_service_fee')
              <th style="border: 1px solid;padding: 5px; ">QTY - QTE</th>
              <th style="border: 1px solid;padding: 5px; ">PRICE - PRIX</th>
              @endif
              <th style="border: 1px solid;padding: 5px; ">AMOUNT - MONTANT</th>
            </tr>
          </thead>
          <tbody>
          @if($order->order_type === 'product')
          @foreach ($order->items as $item)
             <tr>
                  <td style="border: 1px solid;padding: 5px; ">{{ $item->name }}</td>
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $item->qty }}</td>
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $item->sub_total }}</td>
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $item->qty *  $item->sub_total }}</td>

              </tr>
            @endforeach
          @endif

          @if($order->order_type === 'service')
             <tr>
                @if($status == 'extra_service_fee')
                  <td style="border: 1px solid;padding: 5px; ">Extra fee request</td>
                @else
                  <td style="border: 1px solid;padding: 5px; ">{{ $order->item->title }}</td>
                  <td style="border: 1px solid;padding: 5px; "> 1 </td>
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->sub_total }}</td>
                @endif

                @if($status == 'extra_service_fee')
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->extra_service_fee - ($order->extra_fee_gst + $order->extra_fee_pst) }}</td>
                @else
                  <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->sub_total }}</td>
                @endif

              </tr>
          @endif

          </tbody>
        </table>

      <div style="width: 100%;justify-content:flex-end;display: flex;margin-top: 20px;">
          <table style="border-collapse: collapse;width: 50%; margin-left:auto;">
              <tbody>
                  <tr>
                      <td style="border: 1px solid;padding: 5px; ">SUBTOTAL - TOTAL PARTIEL</td>
                      @if($status == 'extra_service_fee')
                        <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->extra_service_fee - ($order->extra_fee_gst + $order->extra_fee_pst) }}</td>
                      @else
                        <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->sub_total }}</td>
                      @endif
                  </tr>
                  @if($status == 'extra_service_fee')

                    @if($order->extra_fee_gst > 0)
                    <tr>
                        <td style="border: 1px solid;padding: 5px; ">GST/HST - TPS/TVH <span>
                        {{ $gst ? $gst . '%'  : '' }}</span></td>
                        <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->extra_fee_gst }}</td>
                    </tr>
                    @endif
                    @if($order->extra_fee_pst > 0)
                    <tr>
                        <td style="border: 1px solid;padding: 5px; ">PST/RST - TVH <span>
                        {{ $pst ? $pst . '%' : '' }}</span>
                      </td>
                        <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->extra_fee_pst }}</td>
                    </tr>
                    @endif
                  @else
                    <tr>
                        <td style="border: 1px solid;padding: 5px; ">COUPON</td>
                        <td style="border: 1px solid;padding: 5px; text-align: center;">{{'- ' . $order->discount }}</td>
                    </tr>
                    @if($order->gst > 0)
                    <tr>
                        <td style="border: 1px solid;padding: 5px; ">GST/HST - TPS/TVH <span>
                        {{ $gst ? $gst . '%'  : '' }}</span></td>
                        <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->gst }}</td>
                    </tr>
                    @endif
                    @if($order->pst > 0)
                    <tr>
                        <td style="border: 1px solid;padding: 5px; ">PST/RST - TVH <span>
                        {{ $pst ? $pst . '%' : '' }}</span>
                      </td>
                        <td style="border: 1px solid;padding: 5px; text-align: center;">{{ $order->pst }}</td>
                    </tr>
                    @endif
                  @endif
                    <tr>
                      <td style="border: 1px solid;padding: 5px; font-weight:bold; ">TOTAL DUE - TOTAL DU</td>
                      @if($status == 'extra_service_fee')
                        <th style="border: 1px solid;padding: 5px; text-align: center;">CAD {{$order->extra_service_fee }}</th>
                      @else
                        <th style="border: 1px solid;padding: 5px; text-align: center;">CAD {{$order->amount }}</th>
                      @endif
                  </tr>
              </tbody>
            </table>
      </div>
</section>

