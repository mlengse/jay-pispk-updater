var oTable;
$(function () {
	$('#tbl-survei').delegate('a.row-delete', 'click', function (e) {
		e.preventDefault();
		var survei_id = $(this).data('id');
		swal({
			title: "Konfirmasi",
			text: "Apakah anda yakin ingin menghapus data Survei?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Ya",
			cancelButtonText: "Batal",
			closeOnConfirm: false,
			closeOnCancel: false
		}, function (isConfirm) {
			if (isConfirm) {
				swal("Sukses!", "Data Survei berhasil dihapus!", "success");
				$.ajax({
					type: 'POST',
					dataType: 'json',
					data: {
						survei_id: survei_id
					},
					url: 'https://keluargasehat.kemkes.go.id/rumah_tangga/delete',
					success: function (r) {
						oTable._fnAjaxUpdate();
					}
				});
			} else {
				swal("Batal", "Proses dibatalkan!", "error");
			}
		});
	});

	$('#tbl-survei').delegate('a.view_iks', 'click', function (e) {
		e.preventDefault();
		var survei_id = $(this).data('id');
		var table = $(this).data('tabel');
		var label = $(this).data('label');

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: 'https://keluargasehat.kemkes.go.id/rumah_tangga/view_iks',
			data: { survei_id: survei_id, table: table },
			success: function (r) {
				var html = '<div class="row">';
				html += '<div class="col-md-12">';
				html += '<table class="table table-bordered table-responsive table-striped table-hover">';
				html += '<tbody>';
				html += '<thead>';
				html += '<tr>';
				html += '<th>No</th>';
				html += '<th>Indikator</th>';
				html += '<th>Nilai</th>';
				html += '</tr>';
				html += '</thead>';

				$.each(r.indikator, function (i, v) {
					html += '<tr>';
					html += '<td>' + v.indikator_id + '</td>';
					html += '<td>' + v.indikator + '</td>';
					html += '<td>' + v.nilai + '</td>';
					html += '</tr>';
				});

				var kategori, warna, style, fwarna;
				if (r.iks > 0.800) {
					kategori = 'KELUARGA SEHAT';
					style = 'success';
					warna = '#2cf13b';
					fwarna = '#000000';
				} else if (r.iks >= 0.500 && r.iks <= 0.800) {
					kategori = 'KELUARGA PRA-SEHAT';
					style = 'warning';
					warna = '#fff705';
					fwarna = '#000000';
				} else {
					kategori = 'TIDAK SEHAT';
					style = 'danger';
					warna = '#f50202';
					fwarna = '#ffffff';
				}

				html += '<tr>';
				//html += '<td colspan="2">Indeks Keluarga Sehat = (&#931; Y) / (&#931; Y + &#931; T) * 100%<br/>' +
				//'('+ r.y +')/('+ r.y +' + '+ r.t +') * 100%</td>';
				html += '<td colspan="2">Indeks Keluarga Sehat = &#931; Y / (12 - &#931; N)<br/>' +
					+ r.y + '/(12 - ' + r.n + ')</td>';
				//html += '<td class="'+ style +'">'+ r.iks +'%</td>';
				html += '<td style="background-color: ' + warna + '; color: ' + fwarna + '">' + r.iks + '</td>';
				html += '</tr>';

				//html += '<tr class="'+style+'">';
				html += '<tr style="background-color: ' + warna + '; color: ' + fwarna + '">';
				html += '<td colspan="3" class="td-center">' + kategori + '</td>';
				html += '</tr>';
				html += '</tbody>';
				html += '</table>';
				html += '</div>';
				html += '</div>';

				bootbox.dialog({
					title: 'IKS KELUARGA ' + label.toUpperCase() + ' - ' + r.kk,
					className: 'medium',
					message: html
				});
			}
		});
	});


	$('#tbl-survei').delegate('span.next_visit', 'click', function (e) {
		e.preventDefault();
		var survei_id = $(this).data('id');

		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: 'https://keluargasehat.kemkes.go.id/rumah_tangga/next_visit',
			data: { survei_id: survei_id },
			success: function (r) {
				var html = '<div class="row">';
				html += '<div class="col-md-12">';

				if (r.message == null) {
					html += '<table class="table table-bordered">';
					html += '<thead>';
					html += '<tr>';
					html += '<th>Tanggal</th>';
					html += '<th>Catatan</th>';
					html += '<th>Status</th>';
					html += '</tr>';
					html += '</thead>';
					html += '<tbody>';
					html += '<tr>';
					html += '<td>' + r.data.tanggal + '</td>';
					html += '<td>' + r.data.catatan + '</td>';
					html += '<td>' + r.data.status + '</td>';
					html += '</tr>';
					html += '</tbody>';
					html += '</table>';
				} else {
					html += '<form class="j-forms" id="form-visit">';
					html += '<div class="form-content">';
					html += '<input type="hidden" name="survei_id" value="' + survei_id + '">';

					html += '<div class="span12 unit">';
					html += '<div class="input unit">';
					html += '<label class="icon-right" for="tanggal_visit">';
					html += '<i class="fa fa-calendar"></i>';
					html += '</label>';
					html += '<input class="form-control" type="text" id="tanggal_visit" name="tanggal" readonly="">';
					html += '</div>';
					html += '<div id="tanggal"></div>';
					html += '</div>';

					html += '<div class="span12 unit">';
					html += '<div class="input unit">';
					html += '<label >';
					html += 'Catatan';
					html += '</label>';
					html += '<textarea class="form-control" name="catatan" id="catatan"></textarea>';
					html += '</div>';
					html += '<div id="inline-to"></div>';
					html += '</div>';

					html += '</div>';

					html += '<div class="form-footer">';
					html += '<button type="submit" class="btn btn-success primary-btn" id="simpan-visit">Simpan</button>';
					html += '<button type="reset" class="btn btn-danger secondary-btn">Reset</button>';
					html += '</div>';

					html += '</form>';
				}


				html += '</div>';
				html += '</div>';

				var dialog = bootbox.dialog({
					title: 'Jadwal Kunjungan Berikutnya',
					message: html
				});

				$(function () {
					$("#tanggal").datepicker({
						dateFormat: 'dd/mm/yy',
						altField: "#tanggal_visit",
						minDate: 1,
						prevText: '<i class="fa fa-caret-left"></i>',
						nextText: '<i class="fa fa-caret-right"></i>'
					});

					$("#simpan-visit").on('click', function (e) {
						e.preventDefault();
						//dialog.modal('hide');
						$.ajax({
							type: 'POST',
							dataType: 'json',
							data: $('#form-visit').serializeArray(),
							url: 'https://keluargasehat.kemkes.go.id/rumah_tangga/save_visit',
							success: function (res) {
								if (res.error == false) {
									dialog.modal('hide');
									swal("Notifikasi!", res.message, "success");
								} else {
									swal("Notifikasi!", res.message, "error");
								}
							}
						});
					});
				});
			}
		});

	});

});


$(document).ready(function () {

	oTable = $('#tbl-survei').dataTable({

		"bProcessing": true,
		"bServerSide": true,
		"sAjaxSource": 'https://keluargasehat.kemkes.go.id/rumah_tangga/dt_rumah_tangga',
		"order": [[5, 'asc'], [6, 'asc'], [7, 'asc'], [8, 'asc'], [11, 'asc'], [12, 'asc'], [1, 'asc'], [2, 'asc']],
		"bJQueryUI": true,
		"responsive": true,
		"bAutoWidth": false,
		"sPaginationType": "full_numbers",
		"bDestroy": true,
		"dom": '<"row" <"col-md-6"l><"col-md-6"f>><"row" <"col-md-12"<"td-content"rt>>><"row" <"col-md-6"i><"col-md-6"p>>',
		"fnInitComplete": function () {
		//	oTable.fnAdjustColumnSizing();
		},
		"iDisplayLength": 10,
		"aoColumns": [
			{"data":"survei_id", "sName":"survei_id"},
			{ "data": "no_urut_rt", "sName": "no_urut_rt" },
			{ "data": "no_urut_kel", "sName": "no_urut_kel" },
			{ "data": "tanggal", "sName": "tanggal" },
			{ "data": "nama_kk", "sName": "nama_kk" },
			{ "data": "propinsi", "sName": "propinsi" },
			{ "data": "kota", "sName": "kota" },
			{ "data": "kecamatan", "sName": "kecamatan" },
			{ "data": "kelurahan", "sName": "kelurahan" },
			{ "data": "rw", "sName": "rw" },
			{ "data": "rt", "sName": "rt" },
			{"mData":"surveyor"},

			{
				"data": "iks_inti",
				"sName": "iks_inti",
				"mRender": function (data, type, row) {
					var res;

					if (data == '' || data == null) {
						res = '<span class="label label-danger" title="Belum Lengkap">Belum Lengkap</span>';
					} else {
						res = '<a href="#" class="view_iks" data-id="' + row.survei_id + '" data-tabel="iks_inti" data-label="Inti">' + data + '</a>';
					}
					return res;
				}
			},
			{
				"data": "iks_besar",
				"sName": "iks_besar",
				"mRender": function (data, type, row) {
					var res;

					if (data == '' || data == null) {
						res = '<span class="label label-danger" title="Belum Lengkap">Belum Lengkap</span>';
					} else {
						res = '<a href="#" class="view_iks" data-id="' + row.survei_id + '" data-tabel="iks_besar" data-label="Besar">' + data + '</a>';
					}
					return res;
				}
			},
			{ "data": "aksi" }
		],
		"aoColumnDefs": [
			{
				"bVisible": false,
				"bSortable": false,
				"aTargets": [0]
			},
			{
				"bVisible": true,
				"bSortable": false,
				"bSearchable": false,
				"aTargets": [-1, -2, -3]
			}
		],
		"columnDefs": [
			{
				"targets": [0],
				"visible": false,
				"searchable": false,
				"sortable": true
			},
			{
				"targets": [-1, -2, -3],
				"visible": true,
				"searchable": false,
				"sortable": false
			}
		],
		'fnServerData': function (sSource, aoData, fnCallback) {
			aoData.push({ "name": "edit_priv", "value": " 1" });
			aoData.push({ "name": "delete_priv", "value": " 1" });

			$.ajax
				({
					'dataType': 'json',
					'type': 'POST',
					'url': sSource,
					'data': aoData,
					'success': fnCallback
				});
		}

	});

	$('.dataTables_filter input').addClass('form-control').attr('placeholder', 'Pencarian...');
	$('.dataTables_length select').addClass('form-control');

});

$(function () {

	var tmp;
	tmp = '<div class="row">';
	tmp += '<div class="col-md-12">';
	tmp += '<form id="frm-ganti-pass" class="form-horizontal j-forms">';

	/*
	tmp += '<div class="form-group">';
	tmp += '<label class="col-md-4 control-label" for="old_pass">Password Lama</label>';
	tmp += '<div class="col-md-4">';
	tmp  += '<input id="old_pass" name="old_pass" type="password" class="form-control input-md" required>';
	tmp += '</div>';
	tmp += '</div>';
	*/

	tmp += '<div class="form-group">';
	tmp += '<label class="col-md-4 control-label" for="new_pass">Password Baru</label>';
	tmp += '<div class="col-md-4">';
	tmp += '<input id="pass" name="pass" type="password" class="form-control input-md" required>';
	tmp += '</div>';
	tmp += '</div>';

	tmp += '<div class="form-group">';
	tmp += '<label class="col-md-4 control-label" for="renew_pass">Re-enter Password Baru</label>';
	tmp += '<div class="col-md-4">';
	tmp += '<input id="re_pass" name="re_pass" type="password" class="form-control input-md" required>';
	tmp += '</div>';
	tmp += '</div>';

	tmp += '</form>';
	tmp += '</div>';
	tmp += '</div>';
	$('#ganti_password').on('click', function (e) {
		e.preventDefault();
		var dialog = bootbox.dialog({
			title: 'Ganti Password',
			message: tmp,
			buttons: {
				success: {
					label: "Simpan",
					className: "btn-success update-password",
					callback: function () {
						var form = $('#frm-ganti-pass').serializeArray();
						$.ajax({
							type: 'POST',
							data: form,
							url: 'https://keluargasehat.kemkes.go.id/ganti_password/update_password',
							dataType: 'json',
							success: function (r) {
								console.log(r);
								var a = (r.error == false) ? 'success' : 'error';
								console.log(a);
								swal({
									title: "Notifikasi",
									text: r.message,
									type: a,
									confirmButtonColor: "#4caf50"
								});


							}
						});
					}
				}
			}
		});
	});
});
