var logger = JsLogger.serviceDebugLogger;

var orderid = message.body.orderid;

logger.error("Order ID: " + orderid);

var search_data = new Message();
    search_data.header = message.header;
    search_data.body = {};
    search_data.body.orderid = orderid;

var get_data = CloudServiceAccessor.process("servicecreator.service.po_pay_spe.pp_spe_ppspe_get", search_data).body.result;
logger.error("Get Datas: " + get_data);

var current_operator = get_data.currentoperator;
logger.error("Current Operator: " + get_data.currentoperator);

var originator = get_data.originator;
logger.error("Originator: " + get_data.originator);

var current_phase = get_data.current_phase;
var pr_creation_date = get_data.pr_creation_date;
var po_line_shipment = get_data.po_line_shipment;
var processdefkey = get_data.processdefkey;
var operate_phase = get_data.operate_phase;
var operation_mode_supplier =  get_data.operation_mode_supplier;
var operation_mode_hw_approver_1 = get_data.operation_mode_hw_approver_1;
var operation_mode_hw_approver_2 = get_data.operation_mode_hw_approver_2;
var operation_mode_hw_approver_3 = get_data.operation_mode_hw_approver_3;

html = getHtml(current_operator, originator, orderid, current_phase, pr_creation_date, po_line_shipment, processdefkey, operate_phase, operation_mode_supplier, operation_mode_hw_approver_1, operation_mode_hw_approver_2, operation_mode_hw_approver_3);
    logger.error("Body" + html)

sendEmail(orderid, current_operator, html, operate_phase, operation_mode_supplier, operation_mode_hw_approver_1, operation_mode_hw_approver_2, operation_mode_hw_approver_3);
    
return sendEmail(orderid, current_operator, html, operate_phase, operation_mode_supplier, operation_mode_hw_approver_1, operation_mode_hw_approver_2, operation_mode_hw_approver_3);


function sendEmail(orderid, current_operator, html, operate_phase, operation_mode_supplier, operation_mode_hw_approver_1, operation_mode_hw_approver_2, operation_mode_hw_approver_3)
{
	var sendEmailReq = new Message();
	sendEmailReq.body = {};
	sendEmailReq.body.server_id = "20200226001";
	sendEmailReq.body.content = html;
	sendEmailReq.body.email_from = "indonesiaows1@mail01.huawei.com";
	//sendEmailReq.body.title = "[PO to Payment @OWS] (New) Submit  [" + orderid + "]";
    /*sendEmailReq.body.email_to = getEmail(current_operator);
    sendEmailReq.body.email_bcc = "indri.yani.ext@huawei.com";
    sendEmailReq.body.data_type = 'text/html;charset=utf-8';
	var response = CloudServiceAccessor.process("servicecreator.service.email.email_send_create", sendEmailReq);
	logger.error("response " + response)*/

    if(operate_phase == 'Create SPE' || operate_phase == 'HW Approval 1' || operate_phase == 'HW Approval 2' || operate_phase == 'HW Approval 3')
    {
        if(operate_phase == 'Create SPE')
        {
            sendEmailReq.body.title = "[PO Pay SPE @OWS] (New) Submit [" + orderid + "]";
            if(operation_mode_supplier == 'Reject')
            {
                sendEmailReq.body.email_to = getEmail(originator);
            }
            else
            {
                sendEmailReq.body.email_to = getEmail(current_operator);
            }
        }
        else if(operate_phase == 'HW Approval 1')
        {
            sendEmailReq.body.title = "[PO Pay SPE @OWS] (New) Submit [" + orderid + "]";
            if(operation_mode_hw_approver_1 == 'Reject')
            {
                sendEmailReq.body.email_to = getEmail(originator);
            }
            else
            {
                sendEmailReq.body.email_to = getEmail(current_operator);
            }
        }
        else if(operate_phase == 'HW Approval 2')
        {
             sendEmailReq.body.title = "[PO Pay SPE @OWS] (New) Submit [" + orderid + "]";
             if(operation_mode_hw_approver_2 == 'Reject')
            {
                sendEmailReq.body.email_to = getEmail(originator);
            }
            else
            {
                sendEmailReq.body.email_to = getEmail(current_operator);
            }
        }
        else if(operate_phase == 'HW Approval 3')
        {
             sendEmailReq.body.title = "[PO Pay SPE @OWS] (New) Submit [" + orderid + "]";
             if(operation_mode_hw_approver_3 == 'Reject')
            {
                sendEmailReq.body.email_to = getEmail(originator);
            }
            else
            {
                sendEmailReq.body.email_to = getEmail(current_operator);
            }
        }
    }
    else
    {
        sendEmailReq.body.title = "[PO Pay SPE @OWS] (New) Submit [" + orderid + "]";
        sendEmailReq.body.email_to = getEmail(current_operator);
    }
    sendEmailReq.body.email_bcc = "indri.yani.ext@huawei.com";
    sendEmailReq.body.data_type = 'text/html;charset=utf-8';
	var response = CloudServiceAccessor.process("servicecreator.service.email.email_send_create", sendEmailReq);
	logger.error("response " + response)


    return sendEmailReq;
}

//function get email addr
function getEmail(accountId)
{
    var account = accountId.split(":");
    logger.error("Username: " + account);

    var username = account[1];
    logger.error("Username: " + username);

  var request = new Message();
      request.header = message.header;
      request.body = {};
      request.body.account_id = username.toString();
  var response = CloudServiceAccessor.process("servicecreator.service.usermgt.um_user_get", request).body.result.email;
  return response;
}

//function get full name,
function getFullName(accountId)
{
    var account = accountId.split(":");
    logger.error("Username: " + account);

    var username = account[1];
    logger.error("Username: " + username);

  var request = new Message();
      request.header = message.header;
      request.body = {};
      request.body.account_id = username.toString();
  var response = CloudServiceAccessor.process("servicecreator.service.usermgt.um_user_get", request).body.result.fullname;
  return response;
}


function getHtml(current_processor_name, originator, orderid, current_phase, pr_creation_date, po_line_shipment, processdefkey, operate_phase, operation_mode_supplier, operation_mode_hw_approver_1, operation_mode_hw_approver_2, operation_mode_hw_approver_3 )
{
    var url = "https://16yg-sggdelike.teleows.com/bpmruntime/ticket/openTicketBasicinfoPage.do?processdefkey=" + processdefkey + "&processstatus=Running&orderid=" + orderid + "&ticketid=" + orderid;

    if(operate_phase == 'Create SPE')
    {
        if(operation_mode_supplier == 'Reject')
        {
        logger.error("Originator: " + originator);
        var content = "<b>Dear " + getFullName(current_processor_name) + ", </b><br><br><br>" +
            "Kindly be informed that there is a new request for PO to Payment from " + getFullName(originator) + "." +
            "<br> Please find for the details." +
            "<br><br>Ticket details:<br> " +
            "<table>" +
            "<tr> <td width='180'>Ticket  No.</td> <td>: " + orderid + "</td></tr>" +
            "<tr> <td>Current Phase</td> <td>: " + current_phase + "</td></tr>" +       
            "<tr> <td>PO Create Time</td> <td>: " + pr_creation_date + "</td></tr>" +
            "<tr> <td>PO Line Shipment</td> <td>: " + po_line_shipment + "</td></tr>" +
            "<tr> <td>Supplier Review</td> <td>: " + operation_mode_supplier + "</td></tr>" +

            "</table>" +
            "<br><br> To open and check more details, please open this link below. <br>" +
            "<a href=" + url + ">URL</a>. <b>(*Use only Google Chrome browser)</b>" +
            "<p>&nbsp;</p><span style=\"font-family: andale mono;\"><span style=\"font-size: 14px;\">Thanks &amp; regards</span><strong><span style=\"font-size: 14px;\"><br/> <strong>Indonesia OWS</strong><br/> <br/> </span><em><span style=\"font-size: 10px;\">This email is sent automatically for the notification purpose only.<br/> Please do not reply to this email.</span></em></strong></span>"  +
            "</body> </html>";
        }
        else if(operation_mode_supplier == 'Accept')
        {
        logger.error("Originator: " + originator);
        var content = "<b>Dear " + getFullName(current_processor_name) + ", </b><br><br><br>" +
            "Kindly be informed that there is a new request for PO to Payment from " + getFullName(originator) + "." +
            "<br> Please find for the details." +
            "<br><br>Ticket details:<br> " +
            "<table>" +
            "<tr> <td width='180'>Ticket  No.</td> <td>: " + orderid + "</td></tr>" +
            "<tr> <td>Current Phase</td> <td>: " + current_phase + "</td></tr>" +       
            "<tr> <td>PO Create Time</td> <td>: " + pr_creation_date + "</td></tr>" +
            "<tr> <td>PO Line Shipment</td> <td>: " + po_line_shipment + "</td></tr>" +
            "<tr> <td>Supplier Review</td> <td>: " + operation_mode_supplier + "</td></tr>" +

            "</table>" +
            "<br><br> To open and check more details, please open this link below. <br>" +
            "<a href=" + url + ">URL</a>. <b>(*Use only Google Chrome browser)</b>" +
            "<p>&nbsp;</p><span style=\"font-family: andale mono;\"><span style=\"font-size: 14px;\">Thanks &amp; regards</span><strong><span style=\"font-size: 14px;\"><br/> <strong>Indonesia OWS</strong><br/> <br/> </span><em><span style=\"font-size: 10px;\">This email is sent automatically for the notification purpose only.<br/> Please do not reply to this email.</span></em></strong></span>"  +
            "</body> </html>";
        }
    }
    else if(operate_phase == 'HW Approval 1')
    {
        if(operation_mode_hw_approver_1 == 'Reject')
        {
            logger.error("Originator: " + originator);
            var content = "<b>Dear " + getFullName(originator) + ", </b><br><br><br>" +
                "Kindly be informed that there is a new request for PO to Payment from you need revision" +
                "<br> Please find for the details." +
                "<br><br>Ticket details:<br> " +
                "<table>" +
                "<tr> <td width='180'>Ticket  No.</td> <td>: " + orderid + "</td></tr>" +
                "<tr> <td>Current Phase</td> <td>: " + current_phase + "</td></tr>" +       
                "<tr> <td>PO Create Time</td> <td>: " + pr_creation_date + "</td></tr>" +
                "<tr> <td>PO Line Shipment</td> <td>: " + po_line_shipment + "</td></tr>" +
                "<tr> <td>HW Approval 1</td> <td>: " + operation_mode_hw_approver_1 + "</td></tr>" +

                "</table>" +
                "<br><br> To open and check more details, please open this link below. <br>" +
                "<a href=" + url + ">URL</a>. <b>(*Use only Google Chrome browser)</b>" +
                "<p>&nbsp;</p><span style=\"font-family: andale mono;\"><span style=\"font-size: 14px;\">Thanks &amp; regards</span><strong><span style=\"font-size: 14px;\"><br/> <strong>Indonesia OWS</strong><br/> <br/> </span><em><span style=\"font-size: 10px;\">This email is sent automatically for the notification purpose only.<br/> Please do not reply to this email.</span></em></strong></span>"  +
                "</body> </html>";
        }
        else if(operation_mode_hw_approver_1 == 'Accept')
        {
            logger.error("Originator: " + originator);
            var content = "<b>Dear " + getFullName(originator) + ", </b><br><br><br>" +
                "Kindly be informed that there is a new request for PO to Payment from you need revision" +
                "<br> Please find for the details." +
                "<br><br>Ticket details:<br> " +
                "<table>" +
                "<tr> <td width='180'>Ticket  No.</td> <td>: " + orderid + "</td></tr>" +
                "<tr> <td>Current Phase</td> <td>: " + current_phase + "</td></tr>" +       
                "<tr> <td>PO Create Time</td> <td>: " + pr_creation_date + "</td></tr>" +
                "<tr> <td>PO Line Shipment</td> <td>: " + po_line_shipment + "</td></tr>" +
                "<tr> <td>HW Approval 1</td> <td>: " + operation_mode_hw_approver_1 + "</td></tr>" +

                "</table>" +
                "<br><br> To open and check more details, please open this link below. <br>" +
                "<a href=" + url + ">URL</a>. <b>(*Use only Google Chrome browser)</b>" +
                "<p>&nbsp;</p><span style=\"font-family: andale mono;\"><span style=\"font-size: 14px;\">Thanks &amp; regards</span><strong><span style=\"font-size: 14px;\"><br/> <strong>Indonesia OWS</strong><br/> <br/> </span><em><span style=\"font-size: 10px;\">This email is sent automatically for the notification purpose only.<br/> Please do not reply to this email.</span></em></strong></span>"  +
                "</body> </html>";
        }    
    }
    else if(operate_phase == 'HW Approval 2')
    {
        if(operation_mode_hw_approver_2 == 'Reject')
        {
            logger.error("Originator: " + originator);
            var content = "<b>Dear " + getFullName(originator) + ", </b><br><br><br>" +
                "Kindly be informed that there is a new request for PO to Payment from you need revision" +
                "<br> Please find for the details." +
                "<br><br>Ticket details:<br> " +
                "<table>" +
                "<tr> <td width='180'>Ticket  No.</td> <td>: " + orderid + "</td></tr>" +
                "<tr> <td>Current Phase</td> <td>: " + current_phase + "</td></tr>" +       
                "<tr> <td>PO Create Time</td> <td>: " + pr_creation_date + "</td></tr>" +
                "<tr> <td>PO Line Shipment</td> <td>: " + po_line_shipment + "</td></tr>" +
                "<tr> <td>HW Approval 2</td> <td>: " + operation_mode_hw_approver_2 + "</td></tr>" +

                "</table>" +
                "<br><br> To open and check more details, please open this link below. <br>" +
                "<a href=" + url + ">URL</a>. <b>(*Use only Google Chrome browser)</b>" +
                "<p>&nbsp;</p><span style=\"font-family: andale mono;\"><span style=\"font-size: 14px;\">Thanks &amp; regards</span><strong><span style=\"font-size: 14px;\"><br/> <strong>Indonesia OWS</strong><br/> <br/> </span><em><span style=\"font-size: 10px;\">This email is sent automatically for the notification purpose only.<br/> Please do not reply to this email.</span></em></strong></span>"  +
                "</body> </html>";
        }
        else if(operation_mode_hw_approver_2 == 'Accept')
        {
            logger.error("Originator: " + originator);
            var content = "<b>Dear " + getFullName(originator) + ", </b><br><br><br>" +
                "Kindly be informed that there is a new request for PO to Payment from you need revision" +
                "<br> Please find for the details." +
                "<br><br>Ticket details:<br> " +
                "<table>" +
                "<tr> <td width='180'>Ticket  No.</td> <td>: " + orderid + "</td></tr>" +
                "<tr> <td>Current Phase</td> <td>: " + current_phase + "</td></tr>" +       
                "<tr> <td>PO Create Time</td> <td>: " + pr_creation_date + "</td></tr>" +
                "<tr> <td>PO Line Shipment</td> <td>: " + po_line_shipment + "</td></tr>" +
                "<tr> <td>HW Approval 1</td> <td>: " + operation_mode_hw_approver_2 + "</td></tr>" +

                "</table>" +
                "<br><br> To open and check more details, please open this link below. <br>" +
                "<a href=" + url + ">URL</a>. <b>(*Use only Google Chrome browser)</b>" +
                "<p>&nbsp;</p><span style=\"font-family: andale mono;\"><span style=\"font-size: 14px;\">Thanks &amp; regards</span><strong><span style=\"font-size: 14px;\"><br/> <strong>Indonesia OWS</strong><br/> <br/> </span><em><span style=\"font-size: 10px;\">This email is sent automatically for the notification purpose only.<br/> Please do not reply to this email.</span></em></strong></span>"  +
                "</body> </html>";
        }    
    }
    else if(operate_phase == 'HW Approval 3')
    {
        if(operation_mode_hw_approver_3 == 'Reject')
        {
            logger.error("Originator: " + originator);
            var content = "<b>Dear " + getFullName(originator) + ", </b><br><br><br>" +
                "Kindly be informed that there is a new request for PO to Payment from you need revision" +
                "<br> Please find for the details." +
                "<br><br>Ticket details:<br> " +
                "<table>" +
                "<tr> <td width='180'>Ticket  No.</td> <td>: " + orderid + "</td></tr>" +
                "<tr> <td>Current Phase</td> <td>: " + current_phase + "</td></tr>" +       
                "<tr> <td>PO Create Time</td> <td>: " + pr_creation_date + "</td></tr>" +
                "<tr> <td>PO Line Shipment</td> <td>: " + po_line_shipment + "</td></tr>" +
                "<tr> <td>HW Approval 3</td> <td>: " + operation_mode_hw_approver_3 + "</td></tr>" +

                "</table>" +
                "<br><br> To open and check more details, please open this link below. <br>" +
                "<a href=" + url + ">URL</a>. <b>(*Use only Google Chrome browser)</b>" +
                "<p>&nbsp;</p><span style=\"font-family: andale mono;\"><span style=\"font-size: 14px;\">Thanks &amp; regards</span><strong><span style=\"font-size: 14px;\"><br/> <strong>Indonesia OWS</strong><br/> <br/> </span><em><span style=\"font-size: 10px;\">This email is sent automatically for the notification purpose only.<br/> Please do not reply to this email.</span></em></strong></span>"  +
                "</body> </html>";
        }
        else if(operation_mode_hw_approver_3 == 'Accept')
        {
            logger.error("Originator: " + originator);
            var content = "<b>Dear " + getFullName(originator) + ", </b><br><br><br>" +
                "Kindly be informed that there is a new request for PO to Payment from you need revision" +
                "<br> Please find for the details." +
                "<br><br>Ticket details:<br> " +
                "<table>" +
                "<tr> <td width='180'>Ticket  No.</td> <td>: " + orderid + "</td></tr>" +
                "<tr> <td>Current Phase</td> <td>: " + current_phase + "</td></tr>" +       
                "<tr> <td>PO Create Time</td> <td>: " + pr_creation_date + "</td></tr>" +
                "<tr> <td>PO Line Shipment</td> <td>: " + po_line_shipment + "</td></tr>" +
                "<tr> <td>HW Approval 3</td> <td>: " + operation_mode_hw_approver_3 + "</td></tr>" +

                "</table>" +
                "<br><br> To open and check more details, please open this link below. <br>" +
                "<a href=" + url + ">URL</a>. <b>(*Use only Google Chrome browser)</b>" +
                "<p>&nbsp;</p><span style=\"font-family: andale mono;\"><span style=\"font-size: 14px;\">Thanks &amp; regards</span><strong><span style=\"font-size: 14px;\"><br/> <strong>Indonesia OWS</strong><br/> <br/> </span><em><span style=\"font-size: 10px;\">This email is sent automatically for the notification purpose only.<br/> Please do not reply to this email.</span></em></strong></span>"  +
                "</body> </html>";
        }    
    }
    return content;
    
}

function doService(appNameAndServiceName, params) {
	var request = new Message();
	request.header = message.header;
	request.body = params;
	return CloudServiceAccessor.process("app.service." + appNameAndServiceName, request);
}