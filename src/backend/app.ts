import { app, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron';

const { resetUploadUrl } = require( './common/upload_code' );
import { AppEnums } from './app.enums';
import * as path from 'path';
import * as fs from 'fs';
import { autoUpdater } from "electron-updater";
import log from 'electron-log';
import { UsbService } from "./usb.service";


/**
 * Windows
 */
let mainWindow: BrowserWindow|undefined;


let aboutSoftware: BrowserWindow|undefined;

let codeWindow: BrowserWindow|undefined;

let serialMonitor: BrowserWindow|undefined;

let currentFilePath = '';

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
log.transports.file.level = 'info';
log.info( 'App starting...' );


let menuTemplate = [
	{
		label: AppEnums.APP_TITLE,
		submenu: [
			{
				label: 'Code View',
				click() {
					if (!codeWindow) {
						codeWindow = new BrowserWindow({
							title: 'Code View',
							width: 500,
							height: 520,
							autoHideMenuBar: true
						});
						codeWindow.loadURL('file://' + path.join(__dirname, 'view', 'code-view.html'));
					}
					codeWindow.show();
					codeWindow.on('close', () => codeWindow = null);
				}
			},

			{
				label: 'About Software',
				click() {
					if (!aboutSoftware) {
						aboutSoftware = new BrowserWindow({
							title: 'About ElectroBlocks IDE',
							width: 500,
							height: 520,
							autoHideMenuBar: true
						});
						aboutSoftware.loadURL('file://' + path.join(__dirname, 'view', 'about.html'));
						aboutSoftware.show();
					}

					aboutSoftware.on('close', () => aboutSoftware = null);
				}
			},
			{
				label: 'Close',
				click() {
					app.quit();
				}
			},
			{
				role: 'toggledevtools'
			},

		]
	},
	{
		label: 'File',
		submenu: [
			{
				label: 'New',
				click() {
					currentFilePath = undefined;
					mainWindow.webContents.send('menu:new');
				}
			},
			{
				label: 'Open',
				click() {
					dialog.showOpenDialog(mainWindow, {
						properties: ['openFile'],
						filters: [
							{name: 'ElectroBlocks', extensions: ['xml']}
						]
					}, (filePaths, err) => {
						if (err) {
							console.log(err);
							mainWindow.webContents.send(AppEnums.NODE_ERROR, 'There was an error trying to open the file.');
							return;
						}
						if (filePaths && filePaths.length > 0) {
							const filePath = filePaths[0];
							currentFilePath = filePath;
							mainWindow.webContents.send('open:file', fs.readFileSync(filePath).toString());
						}
					});
				}
			},
			{
				label: 'Save',
				click() {
					mainWindow.webContents.send('menu:save', typeof currentFilePath === 'undefined');
				}
			},
			{
				label: 'Save As',
				click() {
					mainWindow.webContents.send('menu:save', true);
				}
			},
			{
				label: 'Close',
				click() {
					app.quit();
				}
			}
		]
	},
	{
		label: 'Edit',
		submenu: [
			{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
			{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
			{ label: 'Cut', accelerator: "CmdOrCtrl+X", selector: "cut:" },

		]
	},
	{
		label: 'Url Settings',
		submenu: [
			{
				label: 'Change Upload Url',
				click() {
					mainWindow.webContents.send('menu:changeUploadUrl');
				}
			},
			{
				label: 'Reset Upload Url',
				click() {
					resetUploadUrl()
				}
			},
		]
	},
	{
		label: 'Help',
		submenu: [
			{
				label: 'Online Help',
				click () {
					shell.openExternal('http://codingwithnoah.com/arduino-ide-help')
				}
			},
			{
				label: 'Report a bug',
				click() {
					shell.openExternal('https://github.com/phptuts/ElectroBlocks/issues')
				}
			},
		]
	}
];

const usbService = new UsbService();

const start = () => {
	mainWindow = new BrowserWindow( {
		title: AppEnums.APP_TITLE,
		width: 1400,
		height: 900,
		icon: path.join( 'icons', 'icon.png' )
	} );

	mainWindow.loadURL( 'file://' + path.join( __dirname, 'view', 'workspace.html' ) );
	Menu.setApplicationMenu( Menu.buildFromTemplate( menuTemplate ) );
	mainWindow.on( 'close', () => app.quit() );

};

app.on('ready', async () => {
	await autoUpdater.checkForUpdatesAndNotify();

	start();
});


ipcMain.on('open:serial-monitor', () => {
	if (!serialMonitor) {
		serialMonitor = new BrowserWindow({
			title: 'Serial Monitor',
			width: 520,
			height: 520,
			autoHideMenuBar: true
		});
		serialMonitor.loadURL('file://' + path.join(__dirname, 'view', 'serial-monitor.html'));
		serialMonitor.show();
	}

	serialMonitor.on('close', () => {
		serialMonitor = null;
		mainWindow.webContents.send('close:serial-monitor');
	});
});

ipcMain.on('get:code', () => mainWindow.webContents.send('get:code'));

ipcMain.on('display:code', (event: any, code: string) => {
	if (codeWindow) {
		codeWindow.webContents.send('show:code', code);
	}
});

ipcMain.on('debug:continue', async () => await usbService.sendMessage('s|'));

ipcMain.on('send:message', async (e: any, word: string) => {
	await usbService.sendMessage(word);
});

ipcMain.on('save:file', (e: any, code: string, filePath?: string) => {
	currentFilePath = filePath ? filePath : currentFilePath;
	fs.writeFile(currentFilePath, code, err => {
		if (err) {
			mainWindow.webContents.send(AppEnums.NODE_ERROR, 'There was an trying to save the file.');
			return;
		}
	});
});


autoUpdater.on('checking-for-update', () => {
	log.error('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
	log.error('Update available. \n' + JSON.stringify(info));
});
autoUpdater.on('update-not-available', (info) => {
	log.error('Update not available.\n' + JSON.stringify(info));
});
autoUpdater.on('error', (err) => {
	log.error('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
	let log_message = "Download speed: " + progressObj.bytesPerSecond;
	log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
	log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
	log.error(log_message);
});
autoUpdater.on('update-downloaded', (info) => {
	log.error('Update downloaded\n' + JSON.stringify(info));
});
