import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;
import java.net.UnknownHostException;
 
 
public class TcpClientTest2 {
 
	/**
	 * @param args
	 */
	public static void main(String[] args) {
 
		try {
			Socket socket = new Socket("192.168.56.101", 8107);
 
			// �Է� ��Ʈ��
			// �������� ���� �����͸� ����
			BufferedReader in = new BufferedReader(new InputStreamReader(
					socket.getInputStream()));
 
			// ��� ��Ʈ��
			// ������ �����͸� �۽�
			OutputStream out = socket.getOutputStream();
 
			// ������ ������ �۽�
			out.write("answer".getBytes());
			out.flush();
			System.out.println("�����͸� �۽� �Ͽ����ϴ�.");
 
			String line = in.readLine();
			System.out.println("������ ������ ���� : " + line);
 
			// ���� ���� ����
			in.close();
			out.close();
			socket.close();
 
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
 
	}
 
}